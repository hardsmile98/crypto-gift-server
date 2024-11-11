import type { IUser } from './user.types'
import { User } from './user.model'
import { type UpdateQuery } from 'mongoose'

const userRepository = {
  findByTelegramId: async (telegramId: number) => {
    return await User.findOne({ telegramId }).lean()
  },

  findById: async (id: string) => {
    return await User.findById(id).lean()
  },

  createUser: async (userData: Partial<IUser>): Promise<IUser> => {
    const user = await User.create(userData)
    return user
  },

  updateUser: async (id: string, update: UpdateQuery<IUser>) => {
    await User.updateOne(
      { _id: id },
      { ...update },
      { new: true }
    )
  },

  getLeaderboard: async (limit: number) => {
    return await User.find()
      .sort({ giftsReceived: -1, createdAt: 1 })
      .limit(limit)
      .lean()
  },

  findHigherRankCount: async (user: IUser): Promise<number> => {
    const result = await User.aggregate([
      {
        $match: {
          $or: [
            { giftsReceived: { $gt: user.giftsReceived } },
            {
              giftsReceived: user.giftsReceived,
              createdAt: { $lt: user.createdAt }
            }
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
