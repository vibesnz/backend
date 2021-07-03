import Express from 'express';
import cors from 'cors';
import { route } from './routes';

const port = 3000;

export const shitHTML = `
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react@17/umd/react.production.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.js" crossorigin></script>
<div style='display: block !important; position: fixed !important; top: 1rem !important; right: 1rem !important; border-radius: 8px !important; background-color: white !important; z-index: 90000000 !important; padding: 1rem !important;box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08) !important; '>
<h1 style='font-size: 1.5rem !important; font-family: "comic sans ms" !important; color: black !important; margin-bottom: 1rem !important;'>Vibe AI </h1>
<ul style='font-size: 1rem !important; font-family: "comic sans ms" !important; color: black !important;'>
<li>step 1: Fire your engineering, design and product teams</li>
<li>step 2: Type in the product you want in the field below</li>
<li>step 3: Hit submit and let our AI build your product</li>
</ul>
<form method="POST" action="/template" style='margin-top: 1rem !important!'>
  <textarea style='font-family: "comic sans ms" !important' name="content" placeholder="Enter your 1M dollar idea here"  rows="5" cols="50" required></textarea>
  <br>
  <br>
  <button type="submit" style='font-family: "comic sans ms" !important'>submit</button>
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
