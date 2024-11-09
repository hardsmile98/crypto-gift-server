import { StatusCodes } from 'http-status-codes'
import { type Request, type Response, type NextFunction } from 'express'
import { type AnyZodObject, ZodError } from 'zod'

export const validateRequest =
  (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction): void => {
      try {
        schema.parse({
          body: req.body,
          params: req.params,
          query: req.query,
          headers: req.headers
        })
        next()
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            message: 'Error in validation data',
            data: {
              errors: error.issues.map((issue) => ({
                message: issue.message
              }))
            }
          })
        } else {
          next(error)
        }
      }
    }
