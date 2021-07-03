import Express from 'express';
import cors from 'cors';
import { route } from './routes';

const port = 3000;

export const shitHTML = `
<h1>Vibe City</h1>
<ul>
<li>step 1: fire your engineering, design and product teams</li>
<li>step 2: type in the product you want in the field below</li>
<li>step 3: hit submit</li>
</ul>
<form method="POST" action="/template">
  <textarea name="content" placeholder="Enter your 1M dollar idea here"  rows="5" cols="50" required></textarea>
  <br>
  <br>
  <button type="submit">submit</button>
</form>
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