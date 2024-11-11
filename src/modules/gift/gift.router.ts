import { Router } from 'express'

import { validateRequest } from '@/middlewares'
import { giftController } from './gift.controller'
import { getGiftSchema } from './gift.schema'

const giftRouter = Router()

giftRouter.get(
  '/gift/all',
  giftController.getGifts
)

giftRouter.get(
  '/gift',
  validateRequest(getGiftSchema),
  giftController.getGiftById
)

export { giftRouter }
