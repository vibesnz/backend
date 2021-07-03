import { Request, Response } from 'express';
import { camelCase, upperFirst } from 'lodash'
import fetch from "node-fetch";
import { shitHTML } from '../index';

const template: string[] = [];

export function getTemplateHandler(req: Request, res: Response) {
  return res.json({ template }).end();
}

export async function postTemplateHandler(req: Request, res: Response) {
  // TODO: shit
  template.push(await shittyScript(req.body.content));
  return res.send(`${shitHTML}${template.reverse().reduce((acc, snipet) => `${acc} ${snipet}`, '')}`);
}

// this function will do a post request using fetch API
async function post(prompt: string): Promise<string> {

  const functionName = `${upperFirst(camelCase(prompt.split(" ").slice(0,2).join(" ")))}Component(){`

  const exampleComponent = `
  // This is a Bootstrap based component
  // A marketing home page
  function HomePageComponent() {
    return (
      <div class="container">
      <div class="masthead">
        <h3 class="text-muted">Project name</h3>
        <nav>
          <ul class="nav nav-justified">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="#">Projects</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Downloads</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </div>
      <div class="jumbotron">
        <h1>Marketing stuff!</h1>
        <p class="lead">Cras justo odio, dapibus ac facilisis in, egestas eget quam. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet.</p>
        <p><a class="btn btn-lg btn-success" href="#" role="button">Get started today</a></p>
      </div>
      <div class="row">
        <div class="col-lg-4">
          <h2>Safari bug warning!</h2>
          <p class="text-danger">As of v9.1.2, Safari exhibits a bug in which resizing your browser horizontally causes rendering errors in the justified nav that are cleared upon refreshing.</p>
          <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
          <p><a class="btn btn-primary" href="#" role="button">View details &raquo;</a></p>
        </div>
        <div class="col-lg-4">
          <h2>Heading</h2>
          <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
          <p><a class="btn btn-primary" href="#" role="button">View details &raquo;</a></p>
       </div>
        <div class="col-lg-4">
          <h2>Heading</h2>
          <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa.</p>
          <p><a class="btn btn-primary" href="#" role="button">View details &raquo;</a></p>
        </div>
      </div>
      <footer class="footer">
        <p>&copy; 2016 Company, Inc.</p>
      </footer>
    </div>
    )
  }`

  const data = {
    "prompt": `/ Language: javascript\n// Path: Component.js\nimport React from 'react'\n\n ${exampleComponent} \n// This is a Bootstrap based component which does \n// ${prompt}\nfunction ${functionName}
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
  console.log("Fn Name: ", functionName);


  const res = await fetch("https://copilot.githubassets.com/v1/engines/github-multi-stochbpe-cushman-pii/completions", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 205e6622fef1ec521b7f7b175ea8dbe2:1625323825:5dcf6a9f8059dbf9a05875c71e38dee52ea537746bf76b669c0420843a8b3dd1",
      "Openai-Organization": "github-copilot",
      "OpenAI-Intent": "copilot-ghost",
      "Content-Type": "application/json",
      "Accept": "application/json"

    }
  });
  const text = await res.text();
  return text;
}


async function shittyScript(prompt: string) {
  let data = await post(prompt);

  data = data.replace(/\[DONE\]/gi, '');

  const x = data.split("data:");

  let res = {
  };

  for (const v of x) {
    const value = v.trim();
    // console.log('value',value)

    if (!value) {
      continue;
    }
    const data = JSON.parse(value);
    // console.log('data', data)

    if (!data.choices) {
      console.log("CHOICES: ", data);
      continue;
    }
    const choice = data.choices[0];
    // console.log(`[${choice.index}] - ${choice.text}`);
    // res += choice.text;

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

  matches.sort((a, b) => b.length - a.length);

  if (matches.length) {
    console.log("Result :", matches[0]);
    return matches[0];
  }
}
