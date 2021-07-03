import { Request, Response } from 'express';
import { camelCase, upperFirst } from 'lodash'
import Mustache from 'mustache';
import fetch from "node-fetch";
import { mainTemplate } from '..';

const template: string[] = [];

export function getTemplateHandler(req: Request, res: Response) {
  return res.json({ template }).end();
}

export async function postTemplateHandler(req: Request, res: Response) {
  try {
    const solution = await getSolution(req.body.content, req.body.functionName)
    if (solution) {
      template.push(solution);
    }
    else {
      template.push('<div><font color="red">Empty response from Github Copilot</font></div>')
    }  
  } catch (error) {
    console.log('Github Copilot error', error);
    template.push(`<div><font color="red">Github Copilot error: ${error.message}</font></div>`)
  }
  const rest = template.reverse().reduce((acc, snipet) => `${acc} ${snipet}`, '')
  return res.send(Mustache.render(mainTemplate, { rest }))
}

// this function will do a post request using fetch API
async function post(prompt: string, functionNameInput:string): Promise<string> {

  const functionName = `${upperFirst(camelCase(functionNameInput.split(" ").slice(0,2).join(" ")))}Component(){`

  const data = {
    "prompt": `/ Language: javascript\n// Path: Component.js\nimport React from 'react'\n\n// Bootstrap Marketing component \n// ${prompt}\nfunction ${functionName}
      return (`,
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
      "Authorization": "Bearer 205e6622fef1ec521b7f7b175ea8dbe2:1625323825:5dcf6a9f8059dbf9a05875c71e38dee52ea537746bf76b669c0420843a8b3dd1",
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
  console.log('Post data :',data)

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

  const regexp = /<.*>.*<\/.*>/gms;
  const matches = [];

  for (const [key, value] of Object.entries(res)) {
    const match = value.match(regexp);
    if (match && match.length > 0) {
      matches.push(match[0]);
    }
  }

  matches.sort((a, b) => a.length - b.length);

  if (matches.length) {
    const result = matches[0].replace(/className/g, "class");
    console.log("Result :", result);
    return result
  }
}
