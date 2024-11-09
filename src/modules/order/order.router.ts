import { Router } from 'express'

import { validateRequest } from '../../middlewares'
import {
  buyGiftSchema,
  getGiftHistorySchema,
  getOrderById,
  getOrderByPaymentIdSchema,
  getOrdersByStatusSchema,
  getReceivedOrders
} from './order.schema'
import { orderController } from './order.controller'

const orderRouter = Router()

orderRouter.post(
  '/order/buyGift',
  validateRequest(buyGiftSchema),
  orderController.buyGift
)

orderRouter.get(
  '/order/byPaymentId',
  validateRequest(getOrderByPaymentIdSchema),
  orderController.getOrderByPaymentId
)

orderRouter.get(
  '/order/byStatus',
  validateRequest(getOrdersByStatusSchema),
  orderController.getOrdersByStatus
)

orderRouter.get(
  '/order/giftHistory',
  validateRequest(getGiftHistorySchema),
  orderController.getGiftHistory
)

orderRouter.get(
  '/order',
  validateRequest(getOrderById),
  orderController.getOrdersById
)

orderRouter.get(
  '/order/received',
  validateRequest(getReceivedOrders),
  orderController.getOrdersReceivedByUser
)

orderRouter.get(
  '/order/userHistory',
  orderController.getOrderHistory
)

export { orderRouter }