import { Schema, model } from 'mongoose'
import { type IOrder, type IOrderAction } from './order.type'

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  giftId: {
    type: Schema.Types.ObjectId,
    ref: 'Gift',
    required: true
  },
  status: {
    type: String,
    enum: ['purchased', 'sent'],
    default: 'purchased'
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  sendDate: Date,
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

orderSchema.index({ status: 1 })
orderSchema.index({ paymentId: 1 })

const orderActionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['purchase', 'send', 'receive'],
    required: true
  },
  associatedOrderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }
}, {
  timestamps: true
})

orderActionSchema.index({ userId: 1 })

export const Order = model<IOrder>('Order', orderSchema)
export const OrderAction = model<IOrderAction>('OrderAction', orderActionSchema)
