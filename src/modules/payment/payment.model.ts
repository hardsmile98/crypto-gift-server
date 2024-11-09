import { Schema, model } from 'mongoose'
import { type IPayment } from './payment.types'

const paymentSchema = new Schema({
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
    enum: ['active', 'processed'],
    default: 'active',
    required: true
  },
  invoiceId: {
    type: Schema.Types.Number
  },
  createAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

paymentSchema.index({ invoiceId: 1 })

export const Payment = model<IPayment>('Payment', paymentSchema)
