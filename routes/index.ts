import { Router } from 'express';

const route = Router();

route.get('/heatlhCheck', (_, res) => {
  res.json({ success: true }).send();
});


export {
  route
};
