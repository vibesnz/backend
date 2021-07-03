import Express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { route } from './routes';

const port = 3000;

const server = Express();
server.use(cors());
server.use(json());

server.use('/api', route);

server.listen(port, () => { console.log("Good vibes only"); });