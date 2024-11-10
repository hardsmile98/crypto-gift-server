import { Router } from 'express'

import {
  authRouter,
  giftRouter,
  paymentRouter,
  userRouter,
  orderRouter,
  botRouter
} from '../modules'
import { checkAuthMiddleware } from '../middlewares'

const routerWithoutAuth: Router = Router().use(
  authRouter,
  paymentRouter,
  botRouter
)

const routerWithAuth: Router = Router().use(
  checkAuthMiddleware,
  giftRouter,
  userRouter,
  orderRouter
)

const rootRouter: Router = Router().use(
  routerWithoutAuth,
  routerWithAuth
)

export { rootRouter }
