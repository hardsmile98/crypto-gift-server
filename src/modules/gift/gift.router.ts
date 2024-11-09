import { Router } from 'express'

import { giftController } from './gift.controller'
import { validateRequest } from '../../middlewares'
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
