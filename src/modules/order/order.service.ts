import { generateRandomHash } from '@/utils'
import { botApiService, giftSevice, userSevice, type IPayment } from '@/modules'
import { orderRepository } from './order.repository'
import { OrderActions, type IExtendOrder } from './order.type'

const orderService = {
  purchaseGift: async (payment: IPayment) => {
    const newOrder = await orderRepository.createOrder({
      paymentId: payment._id,
      userId: payment.userId,
      giftId: payment.giftId,
      hash: generateRandomHash(64),
      purchaseDate: Date.now()
    })

    await orderService.addHistoryRecord(newOrder.userId, newOrder._id, OrderActions.purchase)

    await giftSevice.decreaseAvailable(payment.giftId)

    const gift = await giftSevice.getGift(newOrder.giftId)
    const user = await userSevice.getUserById(newOrder.userId)

    if (gift !== null && user !== null) {
      await botApiService.orderNotification({
        telegramId: user.telegramId,
        action: OrderActions.purchase,
        orderDetail: {
          gift: gift.name
        }
      })
    }
  },

  receiveGift: async (order: IExtendOrder, recipientId: string) => {
    await orderRepository.updateOrder(order._id, { status: 'sent', sendDate: Date.now(), recipientId })

    await userSevice.increaseGiftsReceived(recipientId)
    await userSevice.increaseGiftsSent(order.userId._id)

    const receivedOrder = await orderRepository.findExtendOrderById(order._id)

    await orderService.addHistoryRecord(recipientId, order._id, OrderActions.receive)
    await orderService.addHistoryRecord(order.userId._id, order._id, OrderActions.send)

    if (receivedOrder !== null) {
      await botApiService.orderNotification({
        telegramId: receivedOrder.userId.telegramId,
        action: OrderActions.send,
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
        action: OrderActions.receive,
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

  addHistoryRecord: async (userId: string, orderId: string, action: OrderActions) => {
    await orderRepository.createOrderAction({
      userId,
      action,
      associatedOrderId: orderId
    })
  },

  getOrderByPaymentId: async (paymentId: string) => {
    return await orderRepository.finOrderByPayment(paymentId)
  },

  getOrdersPusrchased: async (userId: string) => {
    return await orderRepository.findOrdersPusrchased(userId)
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
