import { type NextFunction, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { type IContextRequest } from '../types'
import { logger } from '../lib'

export const checkAuthMiddleware = (
  req: IContextRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (req.context?.userId === undefined) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: 'User is not authorized'
      })

      return
    }

    next()
  } catch (error) {
    logger.error(error)

    res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusCodes.UNAUTHORIZED,
      message: 'User is not authorized'
    })
  }
}
