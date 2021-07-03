import Express from 'express';
import cors from 'cors';
import { route } from './routes';

const port = 3000;

export const shitHTML = `
<div style='display: block !important; position: fixed !important; top: 1rem !important; left: 1rem !important; border-radius: 8px !important; background-color: white !important; z-index: 90000000 !important; padding: 1rem !important;box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08) !important; '>
<h1 style='font-size: 1.5rem !important; font-family: sans-serif !important; color: black !important; margin-bottom: 1rem !important;'>Vibe AI </h1>
<ul style='font-size: 1rem !important; font-family: sans-serif !important; color: black !important;'>
<li>step 1: Fire your engineering, design and product teams</li>
<li>step 2: Type in the product you want in the field below</li>
<li>step 3: Hit submit and let our AI build your product</li>
</ul>
<form method="POST" action="/template" style='margin-top: 1rem !important!'>
  <textarea style='font-family: sans-serif !important' name="content" placeholder="Enter your 1M dollar idea here"  rows="5" cols="50" required></textarea>
  <br>
  <br>
  <button type="submit" style='font-family: sans-serif !important'>submit</button>
</form>
</div>
`

const server = Express();
server.use(cors());
server.use(Express.json());
server.use(Express.urlencoded({ extended: true }));
server.use(Express.static('public'))
server.use('/template', route);
server.get('/', (_, res) => {
  res.send(shitHTML)
})

server.listen(port, () => { console.log("Good vibes only"); });
