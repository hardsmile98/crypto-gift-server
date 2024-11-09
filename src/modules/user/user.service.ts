import { telegramService } from 'modules/telegram'
import { userRepository } from './user.repository'
import { type IUser } from './user.types'

const userSevice = {
  getUserByTelegramId: async (telegramId: bigint): Promise<IUser | null> => {
    const user = await userRepository.findByTelegramId(telegramId)
    return user
  },

  getUserById: async (id: string): Promise<IUser | null> => {
    const user = await userRepository.findById(id)
    return user
  },

  createUser: async (data: Partial<IUser>): Promise<IUser> => {
    if (data.telegramId !== undefined) {
      const avatar = await telegramService.getAvatar(data.telegramId)

      data.avatar = avatar ?? ''
    }

    const newUser = await userRepository.createUser(data)

    return newUser
  },

  getLeaderboard: async (limit: number) => {
    return await userRepository.getLeaderboard(limit)
  },

  getPosition: async (user: IUser) => {
    const higherRankCount = await userRepository.findHigherRankCount(user)

    return higherRankCount + 1
  }
}

export { userSevice }
