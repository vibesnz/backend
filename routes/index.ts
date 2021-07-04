import { Router } from 'express';

import { getTemplateHandler, postTemplateHandler } from './template';
import { reactGetTemplateHandler, reactPostTemplateHandler } from './template2';

const route = Router();

route.get('/healthCheck', (_, res) => {
  res.json({ success: true }).end();
});

route.get('/', getTemplateHandler);
route.post('/', postTemplateHandler);

route.get("/next", reactGetTemplateHandler);
route.post('/next', reactPostTemplateHandler);

export {
  route
};
