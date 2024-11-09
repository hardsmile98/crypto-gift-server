import { Router } from 'express'
import { paymentController } from './payment.controller'
import { checkWebhookUpdates } from '../../middlewares'

const paymentRouter = Router()

paymentRouter.post(
  '/payment/webhook',
  checkWebhookUpdates,
  paymentController.getUpdates
)

export { paymentRouter }
