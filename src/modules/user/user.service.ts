import { userRepository } from './user.repository'
import { type IUser } from './user.types'
import { config } from '../../lib'
import axios from 'axios'

const telegramApiBaseUrl = 'https://api.telegram.org'

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
    const newUser = await userRepository.createUser(data)
    return newUser
  },

  getLeaderboard: async (limit: number) => {
    return await userRepository.getLeaderboard(limit)
  },

  getPosition: async (user: IUser) => {
    const higherRankCount = await userRepository.findHigherRankCount(user)

    return higherRankCount + 1
  },

  getAvatar: async (telegramId: bigint) => {
    const response = await axios.get(
      `${telegramApiBaseUrl}/bot${config.TELEGRAM_BOT_TOKEN}/getUserProfilePhotos`,
      {
        params: {
          user_id: telegramId,
          limit: 1
        }
      }
    )

    const photos = response.data.result?.photos
    if (photos === undefined || photos?.length === 0) {
      return null
    }

    const fileId = photos[0]?.[0]?.file_id

    const fileResponse = await axios.get(
      `${telegramApiBaseUrl}/bot${config.TELEGRAM_BOT_TOKEN}/getFile`,
      {
        params: { file_id: fileId }
      }
    )

    const filePath = fileResponse.data?.result?.file_path as string

    if (filePath === undefined) {
      return null
    }

    const avatarUrl = `${telegramApiBaseUrl}/file/bot${config.TELEGRAM_BOT_TOKEN}/${filePath}`

    return avatarUrl
  }
}

export { userSevice }
