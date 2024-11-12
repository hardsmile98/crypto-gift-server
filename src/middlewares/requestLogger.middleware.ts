import { type NextFunction, type Response, type Request } from 'express'
import { logger } from '@/libs'

export const requestLoggerMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    logger.info(`${req.method} ${req.url}`, {
      query: req.query,
      params: req.params,
      body: req.body,
      cookies: req.cookies
    })

    next()
  } catch (error) {
    next()
  }
}
