import { userSevice } from '../user'
import { generateRandomHash } from '../../utils'
import { giftSevice } from '../gift'
import { type IPayment } from '../payment'
import { orderRepository } from './order.repository'
import { EnumOrderAction, type IOrder, type EnumOrderStatus } from './order.type'
import { botApiService } from '../botApi'

const orderService = {
  purchaseGift: async (payment: IPayment) => {
    const newOrder = await orderRepository.createOrder({
      paymentId: payment._id,
      userId: payment.userId,
      giftId: payment.giftId,
      hash: generateRandomHash(64),
      purchaseDate: Date.now()
    })

    await orderService.addHistoryRecord(newOrder.userId, newOrder, EnumOrderAction.purchase)

    await giftSevice.decreaseAvailable(payment.giftId)

    const gift = await giftSevice.getGift(newOrder.giftId)
    const user = await userSevice.getUserById(newOrder.userId)

    if (gift !== null && user !== null) {
      await botApiService.orderNotification({
        telegramId: user.telegramId,
        action: 'purchase',
        orderDetail: {
          gift: gift.name
        }
      })
    }
  },

  receiveGift: async (order: IOrder, recipientId: string) => {
    await orderRepository.updateOrder(order._id, { status: 'sent', sendDate: Date.now(), recipientId })

    await userSevice.increaseGiftsReceived(recipientId)
    await userSevice.increaseGiftsSent(order.userId)

    const receivedOrder = await orderRepository.findExtendOrderById(order._id)

    await orderService.addHistoryRecord(recipientId, order, EnumOrderAction.receive)
    await orderService.addHistoryRecord(order.userId, order, EnumOrderAction.send)

    if (typeof receivedOrder?.recipientId === 'object' &&
      typeof receivedOrder?.userId === 'object' &&
      typeof receivedOrder?.giftId === 'object') {
      await botApiService.orderNotification({
        telegramId: receivedOrder.userId.telegramId,
        action: 'send',
        orderDetail: {
          gift: receivedOrder.giftId.name,
          from: {
            firstName: receivedOrder.userId.firstName
          },
          to: {
            firstName: receivedOrder.recipientId.firstName
          }
        }
      })

      await botApiService.orderNotification({
        telegramId: receivedOrder.recipientId.telegramId,
        action: 'receive',
        orderDetail: {
          gift: receivedOrder.giftId.name,
          from: {
            firstName: receivedOrder.userId.firstName
          },
          to: {
            firstName: receivedOrder.recipientId.firstName
          }
        }
      })
    }

    return receivedOrder
  },

  addHistoryRecord: async (userId: string, order: IOrder, action: EnumOrderAction) => {
    await orderRepository.createOrderAction({
      userId,
      action,
      associatedOrderId: order._id
    })
  },

  getOrderByPaymentId: async (paymentId: string) => {
    return await orderRepository.finOrderByPayment(paymentId)
  },

  getOrdersByStatus: async (status: EnumOrderStatus, userId: string) => {
    return await orderRepository.findOrdersByStatus(status, userId)
  },

  getGiftHistory: async (giftId: string, limit: number) => {
    return await orderRepository.findGiftHistory(giftId, limit)
  },

  getExtendOrderById: async (id: string) => {
    return await orderRepository.findExtendOrderById(id)
  },

  getOrderById: async (id: string) => {
    return await orderRepository.findOrderById(id)
  },

  getOrdersReceivedByUser: async (userId: string) => {
    return await orderRepository.getOrdersReceivedByUser(userId)
  },

  getOrderHistory: async (userId: string) => {
    return await orderRepository.getOrderHistoryByUserId(userId)
  }
}

export { orderService }
