import Express from 'express';
import cors from 'cors';
import { route } from './routes';
import fs from 'fs'
import Mustache from 'mustache';

export const mainTemplate = fs.readFileSync('./routes/main.mst').toString()
// export const shitHTML = Mustache.render(mainTemplate, {});


const port = 3000;

const server = Express();
server.use(cors());
server.use(Express.json());
server.use(Express.urlencoded({ extended: true }));
server.use(Express.static('public'))
server.use('/template', route);
server.get('/', (_, res) => {
  res.send(Mustache.render(mainTemplate, {}))
})

server.listen(port, () => { console.log("Good vibes only"); });
