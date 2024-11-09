import { Router } from 'express'

import {
  authRouter,
  giftRouter,
  paymentRouter,
  userRouter,
  orderRouter
} from '../modules'
import { checkAuthMiddleware } from '../middlewares'

import { testRouter } from '../modules/test/test.router' // TODO DEL!

const routerWithoutAuth: Router = Router().use(
  authRouter,
  paymentRouter,

  testRouter
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
