import { Schema, model } from 'mongoose'
import type { IUser } from './user.types'

const userSchema = new Schema<IUser>({
  telegramId: {
    type: Number,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  avatar: String,
  lastName: String,
  username: String,
  languageCode: String,
  isPremium: {
    type: Boolean,
    default: false
  },
  giftsReceived: {
    type: Number,
    default: 0
  },
  giftsSent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

userSchema.index({ telegramId: 1 }, { unique: true })
userSchema.index({ giftsReceived: -1, createdAt: -1 })

export const User = model<IUser>('User', userSchema)
