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
  hash: {
    type: String,
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

orderSchema.index({ createdAt: -1 })

const orderActionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
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

export const Order = model<IOrder>('Order', orderSchema)
export const OrderAction = model<IOrderAction>('OrderAction', orderActionSchema)
