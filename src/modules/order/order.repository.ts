import mongoose, { type UpdateQuery } from 'mongoose'
import { type IGift, type IUser } from '@/modules'
import { Order, OrderAction } from './order.model'
import { type IOrderAction, type IOrder, type EnumOrderStatus, type IExtendOrder } from './order.type'

const orderRepository = {
  findExtendOrderById: async (id: string) => {
    const order = await Order.findById(id)
      .populate<{ userId: IUser }>('userId')
      .populate<{ giftId: IGift }>('giftId')
      .populate<{ recipientId: IUser }>('recipientId')
      .lean()
    return order
  },

  findOrderById: async (id: string) => {
    const order = await Order.findById(id).lean()
    return order
  },

  createOrder: async (data: Partial<IOrder>) => {
    const order = await Order.create(data)
    return order
  },

  updateOrder: async (id: string, update: UpdateQuery<IOrder>) => {
    await Order.updateOne(
      { _id: id },
      { ...update },
      { new: true }
    )
  },

  finOrderByPayment: async (paymentId: string) => {
    const order = await Order.findOne({ paymentId, status: 'purchased' })
      .populate<{ userId: IUser }>('userId')
      .populate<{ giftId: IGift }>('giftId')
      .populate<{ recipientId: IUser }>('recipientId')
      .lean()
    return order
  },

  findOrdersByStatus: async (status: EnumOrderStatus, userId: string) => {
    const orders = await Order.find({ status, userId }).sort({ createdAt: -1 })
      .populate<{ giftId: IGift }>('giftId')
      .lean()

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

  createOrderAction: async (data: Partial<IOrderAction>) => {
    const orderAction = await OrderAction.create(data)
    return orderAction
  },

  getOrdersReceivedByUser: async (userId: string) => {
    const orders = await Order.find({
      recipientId: userId
    })
      .populate<{ userId: IUser }>('userId')
      .populate<{ giftId: IGift }>('giftId')
      .sort({ createdAt: -1 })
      .lean()
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
          from: 'orders',
          localField: 'associatedOrderId',
          foreignField: '_id',
          as: 'order'
        }
      },
      {
        $unwind: { path: '$order', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'order.userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
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
        $sort: { createdAt: -1 }
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
        $sort: { date: -1 }
      }
    ])

    return history
  }
}

export { orderRepository }
