import Express from 'express';
import cors from 'cors';
import { route } from './routes';

const port = 3000;

export const shitHTML = `
<html>
  <body>
    <form method="POST" action="/template">
      <textarea name="content"></textarea>
      <button type="submit">Build this</button>
    </form>
  </body>
</html>
`

const server = Express();
server.use(cors());
server.use(Express.urlencoded({ extended: true }));
server.use(Express.static('public'))
server.use('/template', route);
server.get('/', (_, res) => {
  res.send(shitHTML)
})

server.listen(port, () => { console.log("Good vibes only"); });