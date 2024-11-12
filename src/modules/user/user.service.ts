import { botApiService } from '@/modules'
import { userRepository } from './user.repository'
import { type IUser } from './user.types'

const userSevice = {
  getUserByTelegramId: async (telegramId: number) => {
    const user = await userRepository.findByTelegramId(telegramId)

    return user
  },

  getUserById: async (id: string) => {
    const user = await userRepository.findById(id)

    return user
  },

  createUser: async (data: Partial<IUser>) => {
    if (data.telegramId !== undefined) {
      const avatar = await botApiService.getAvatar(data.telegramId)

      data.avatar = avatar ?? ''
    }

    const newUser = await userRepository.createUser(data)

    return newUser
  },

  increaseGiftsReceived: async (id: string) => {
    const user = await userSevice.getUserById(id)

    if (user === null) {
      return
    }

    await userRepository.updateUser(user._id, {
      giftsReceived: user.giftsReceived + 1
    })
  },

  increaseGiftsSent: async (id: string) => {
    const user = await userSevice.getUserById(id)

    if (user === null) {
      return
    }

    await userRepository.updateUser(user._id, {
      giftsSent: user.giftsSent + 1
    })
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
