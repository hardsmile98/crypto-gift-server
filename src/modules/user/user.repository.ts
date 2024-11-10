import type { IUser } from './user.types'
import { User } from './user.model'
import { type UpdateQuery } from 'mongoose'

const userRepository = {
  findByTelegramId: async (telegramId: bigint): Promise<IUser | null> => {
    return await User.findOne({ telegramId })
  },

  findById: async (id: string): Promise<IUser | null> => {
    return await User.findById(id)
  },

  createUser: async (userData: Partial<IUser>): Promise<IUser> => {
    const user = await User.create(userData)
    return user
  },

  updateUser: async (id: string, update: UpdateQuery<IUser>): Promise<void> => {
    await User.updateOne(
      { _id: id },
      { ...update },
      { new: true }
    )
  },

  getLeaderboard: async (limit: number): Promise<IUser[]> => {
    return await User.find().sort({ giftsReceived: -1, createdAt: 1 }).limit(limit)
  },

  findHigherRankCount: async (user: IUser): Promise<number> => {
    const result = await User.aggregate([
      {
        $match: {
          $or: [
            { giftsSent: { $gt: user.giftsSent } },
            { giftsSent: { $eq: user.giftsSent }, createdAt: { $lt: user.createdAt } }
          ]
        }
      },
      {
        $count: 'count'
      }
    ])

    return result.length > 0 ? result[0].count : 0
  }
}

export { userRepository }
