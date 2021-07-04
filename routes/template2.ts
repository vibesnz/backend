import { Request, Response } from 'express';
import { camelCase, upperFirst } from 'lodash'
import Mustache from 'mustache';
import fetch from "node-fetch";
import { mainTemplate2 } from '..';

const template: string[] = [];

export function reactGetTemplateHandler(req: Request, res: Response) {
  const rest = ([...template]).reverse().reduce((acc, snipet) => `${acc} ${snipet}`, '')
  return res.send(Mustache.render(mainTemplate2, { rest }))
}

export async function reactPostTemplateHandler(req: Request, res: Response) {
  const contents = req.body.content
  const functionNames = req.body.functionName
  const prompts = []
  for (let i = 0; i < contents.length; i++) {
    const content = contents[i];
    const functionName = functionNames[i];
    prompts.push({ content, functionName })
  }

  const solutionPromises = prompts.map(prompt => getSolution(prompt.content, prompt.functionName))
  try {
    const solutions = await Promise.all(solutionPromises)
    for (let i = solutions.length - 1; i >= 0; i--) {
      const solution = solutions[i];
      if (solution) {
        template.push(solution);
      }
      else {
        template.push('<div><font color="red">Oops! Our AI couldn\'t vibe with your prompt</font></div>')
      }  
    }
  } catch (error) {
    console.log('Github Copilot error', error);
    template.push(`<div><font color="red">Oh no! The vibes have broken somehow: ${error.message}</font></div>`)
  }
  return reactGetTemplateHandler(req, res)
}

// this function will do a post request using fetch API
async function post(prompt: string, functionNameInput:string): Promise<string> {

  const functionName = `${upperFirst(camelCase(functionNameInput.split(" ").slice(0,2).join(" ")))}Component(){`

  const data = {
    "prompt": `/ Language: typescript\n// Path: Component.ts\nimport React, { useEffect, useState } from 'react'\n\n// ${prompt}\nfunction ${functionName}`,
    "max_tokens": 500,
    "temperature": 0.3,
    "top_p": 1,
    "n": 3,
    "logprobs": 2,
    "stop": ["\n\n\n"],
    "stream": true
  };

  console.log("Prompt: ", prompt);
  console.log("Fn Name: ", functionNameInput);

  const res = await fetch("https://copilot.githubassets.com/v1/engines/github-multi-stochbpe-cushman-pii/completions", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Authorization": "Bearer 205e6622fef1ec521b7f7b175ea8dbe2:1625375988:af1b3ae8d7e3853ec0cb880e0656a060d4c5522c7b60aca4d8611dd3514c5123",
      "Openai-Organization": "github-copilot",
      "OpenAI-Intent": "copilot-ghost",
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });
  if (res.status !== 200) {
    throw new Error(`Bad status: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  return text;
}


async function getSolution(prompt: string, functionName: string): Promise<string | undefined> {
  let data = await post(prompt, functionName);
  data = data.replace(/\[DONE\]/gi, '');

  const dataSections = data.split("data:");
  let res: Record<string, string> = {};

  for (const valueUntrimmed of dataSections) {
    const value = valueUntrimmed.trim();

    if (!value) {
      continue;
    }
    const data = JSON.parse(value);

    if (!data.choices) {
      console.log("DATA WITH NO CHOICES: ", data);
      continue;
    }
    const choice = data.choices[0];

    if (!res[choice.index]) {
      res[choice.index] = "";
    }

    res[choice.index] += choice.text;
  }

  const matches = [];

  for (const [key, value] of Object.entries(res)) {
    matches.push(value);
  }

  matches.sort((a, b) => a.length - b.length);

  if (matches.length) {
    let result = matches[0];

    const exportRegex = /^.*export .*$/gm

    result = result.replace(exportRegex, "");

    console.log(result)

    const id = "a" + +(new Date())

    const res = `
<div class="${id}"></div>
<script type="text/babel">

window.useState = React.useState;
window.useEffect = React.useEffect;

    function Component() {
${result}

const elms = document.querySelectorAll(".${id}");
ReactDOM.render(<Component />, elms[0]);
</script>
`
      return res;
  }
}