import { Request, Response } from 'express'

const template: string[] = []

export function getTemplateHandler(req: Request, res: Response) {
  return res.json({ template }).end()
}

export function postTemplateHandler(req: Request, res: Response) {
  // TODO: shit

  return res.json({ success: true }).end()
}