import { giftSevice } from '../gift'
import { type IPayment } from '../payment'
import { orderRepository } from './order.repository'
import { EnumOrderAction, type EnumOrderStatus } from './order.type'

const orderService = {
  purchaseGift: async (payment: IPayment) => {
    const newOrder = await orderRepository.createOrder({
      paymentId: payment._id,
      userId: payment.userId,
      giftId: payment.giftId,
      purchaseDate: Date.now()
    })

    await orderRepository.createOrderAction({
      userId: payment.userId,
      action: EnumOrderAction.purchase,
      associatedOrderId: newOrder._id
    })

    await giftSevice.decreaseAvailable(payment.giftId)
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
