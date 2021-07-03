import Express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { route } from './routes';

const port = 3000;

const shitHTML = `
<html>
  <body>
    <form method="POST" action="/template">
      <input name="content"/>
    </form>
  </body>
</html>
`

const server = Express();
server.use(cors());
server.use(json());
server.use(Express.static('public'))
server.use('/api', route);
server.get('/', (_, res) => {
  res.send(shitHTML)
})

server.listen(port, () => { console.log("Good vibes only"); });