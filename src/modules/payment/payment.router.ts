import { Router } from 'express'

import { checkWebhookUpdates } from '@/middlewares'
import { paymentController } from './payment.controller'

const paymentRouter = Router()

paymentRouter.post(
  '/payment/webhook',
  checkWebhookUpdates,
  paymentController.getUpdates
)

export { paymentRouter }
