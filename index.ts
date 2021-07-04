import Express from 'express';
import cors from 'cors';
import { route } from './routes';
import fs from 'fs'
import Mustache from 'mustache';
import { getTemplateHandler } from './routes/template';

export const mainTemplate = fs.readFileSync('./routes/main.mst').toString()

const port = 3000;
const server = Express();

server.use(cors());
server.use(Express.json());
server.use(Express.urlencoded({ extended: true }));
server.use(Express.static('public'))
server.use('/template', route);
server.get('/*', getTemplateHandler)

server.listen(port, () => { console.log("Good vibes only"); });
