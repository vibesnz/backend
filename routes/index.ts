import { Router } from 'express';

import { getTemplateHandler, postTemplateHandler } from './template';

const route = Router();

route.get('/heatlhCheck', (_, res) => {
  res.json({ success: true }).end();
});

route.get('/template', getTemplateHandler);
route.post('/template', postTemplateHandler);

export {
  route
};
