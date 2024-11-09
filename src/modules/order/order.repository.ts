import mongoose, { type UpdateQuery } from 'mongoose'
import { Order, OrderAction } from './order.model'
import { type IOrderAction, type IOrder, type EnumOrderStatus, type IExtendOrder } from './order.type'

const orderRepository = {
  findOrderById: async (id: string): Promise<IExtendOrder | null> => {
    const order = await Order.findById(id)
      .populate('userId')
      .populate('giftId')
      .populate('recipientId')
    return order
  },

  createOrder: async (data: Partial<IOrder>): Promise<IOrder> => {
    const order = await Order.create(data)
    return order
  },

  updateOrder: async (id: string, update: UpdateQuery<IOrder>): Promise<void> => {
    await Order.updateOne(
      { _id: id },
      { ...update },
      { new: true }
    )
  },

  finOrderByPayment: async (paymentId: string): Promise<IExtendOrder | null> => {
    const order = await Order.findOne({ paymentId })
      .populate('userId')
      .populate('giftId')
      .populate('recipientId')
    return order
  },

  findOrdersByStatus: async (status: EnumOrderStatus, userId: string): Promise<IExtendOrder[]> => {
    const orders = await Order.find({ status, userId })
      .populate('giftId')

    return orders
  },

  findGiftHistory: async (giftId: string, limit: number): Promise<IExtendOrder[]> => {
    const actions = await OrderAction.aggregate([
      {
        $match: {
          action: { $in: ['purchase', 'send'] }
        }
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'associatedOrderId',
          foreignField: '_id',
          as: 'order'
        }
      },
      {
        $unwind: '$order'
      },
      {
        $match: {
          'order.giftId': new mongoose.Types.ObjectId(giftId)
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'order.recipientId',
          foreignField: '_id',
          as: 'recipient'
        }
      },
      {
        $unwind: { path: '$recipient', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          _id: 1,
          user: '$user',
          action: 1,
          recipient: '$recipient'
        }
      }
    ])

    return actions
  },

  createOrderAction: async (data: Partial<IOrderAction>): Promise<IOrderAction> => {
    const orderAction = await OrderAction.create(data)
    return orderAction
  },

  getOrdersReceivedByUser: async (userId: string): Promise<IExtendOrder[]> => {
    const orders = await Order.find({
      recipientId: userId
    })
      .populate('userId')
      .populate('giftId')
    return orders
  },

  getOrderHistoryByUserId: async (userId: string) => {
    const history = await OrderAction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'associatedOrderId',
          foreignField: '_id',
          as: 'order'
        }
      },
      {
        $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
      },
      {
        $unwind: { path: '$order', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'gifts',
          localField: 'order.giftId',
          foreignField: '_id',
          as: 'gift'
        }
      },
      {
        $unwind: { path: '$gift', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'order.recipientId',
          foreignField: '_id',
          as: 'recipient'
        }
      },
      {
        $unwind: { path: '$recipient', preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          actions: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          date: '$_id',
          actions: {
            $map: {
              input: '$actions',
              as: 'action',
              in: {
                _id: '$$action._id',
                action: '$$action.action',
                user: '$$action.user',
                recipient: '$$action.recipient',
                gift: '$$action.gift'
              }
            }
          }
        }
      },
      {
        $sort: { date: 1 }
      }
    ])

    return history
  }
}

export { orderRepository }
