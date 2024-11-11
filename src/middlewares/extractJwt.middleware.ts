import { type NextFunction, type Request, type Response } from 'express'

import { authServices } from '@/modules'

export const extractJwtMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
): void => {
  try {
    Object.assign(req, { context: {} })

    const accessToken = req.cookies?.authToken

    if (accessToken === null) {
      next()

      return
    }

    const { id } = authServices.jwtVerify({ accessToken })

    if (id === null) {
      next()

      return
    }

    Object.assign(req, {
      context: {
        userId: id
      }
    })

    next()
  } catch (error) {
    next()
  }
}
