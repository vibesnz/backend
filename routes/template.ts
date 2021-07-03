import { Request, Response } from 'express'

import { shitHTML } from '../index'

const template: string[] = []

export function getTemplateHandler(req: Request, res: Response) {
  return res.json({ template }).end()
}

export function postTemplateHandler(req: Request, res: Response) {
  // TODO: shit
  template.push(req.body.content)
  return res.send(`${shitHTML}${template.reduce((acc, snipet) => `${acc} ${snipet}`,'')}`)
}
