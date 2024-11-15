import { Router } from 'express'

import { validateRequest } from '@/middlewares'
import { userController } from './user.controller'
import { getProfileSchema } from './user.schema'

const userRouter = Router()

userRouter.get(
  '/user/profile',
  validateRequest(getProfileSchema),
  userController.getProfile
)

userRouter.get(
  '/user/leaderboard',
  userController.getLeaderboard
)

export { userRouter }
