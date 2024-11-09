import { Router } from 'express'

import { validateRequest } from '../../middlewares'
import { authController } from './auth.controller'
import { getTokenSchema } from './auth.schema'

const authRouter = Router()

authRouter.post(
  '/auth/getToken',
  validateRequest(getTokenSchema),
  authController.getToken
)

export { authRouter }
