import { generateRandomHash } from '../../utils'
import { giftSevice } from '../gift'
import { type IPayment } from '../payment'
import { orderRepository } from './order.repository'
import { EnumOrderAction, type IOrder, type EnumOrderStatus } from './order.type'

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
  },

  receiveGift: async (order: IOrder, recipientId: string) => {
    await orderRepository.updateOrder(order._id, { status: 'sent', sendDate: Date.now() })

    const receivedOrder = await orderRepository.findExtendOrderById(order._id)

    await orderService.addHistoryRecord(recipientId, order, EnumOrderAction.receive)
    await orderService.addHistoryRecord(order.userId, order, EnumOrderAction.send)

    return receivedOrder
  },

  addHistoryRecord: async (userId: string, order: IOrder, action: EnumOrderAction) => {
    await orderRepository.createOrderAction({
      userId,
      action,
      associatedOrderId: order._id
    })

    // Отправка в tg уведомления
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
