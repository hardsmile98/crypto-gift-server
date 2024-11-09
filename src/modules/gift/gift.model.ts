import { Schema, model } from 'mongoose'
import type { IGift } from './gift.types'

const giftSchema = new Schema<IGift>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['USDT', 'TON', 'ETH'],
    required: true
  },
  imageUrl: {
    type: Schema.Types.Mixed,
    required: true
  },
  bgColor: {
    type: String,
    required: true
  },
  maxAvailable: {
    type: Number,
    required: true
  },
  available: {
    type: Number,
    required: true
  }
})
export const Gift = model<IGift>('Gift', giftSchema)
