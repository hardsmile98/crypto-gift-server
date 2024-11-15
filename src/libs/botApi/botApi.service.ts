import axios from 'axios'
import { config, logger } from '@/libs'
import { type NotificationData } from './botApi.types'
import path from 'path'
import { promises as fs } from 'fs'
import { isDev } from '@/utils'

const api = axios.create({
  baseURL: `${config.BOT_API_URL}/bot/api/${config.TELEGRAM_BOT_TOKEN}`,
  headers: {
    'Content-Type': 'application/json'
  }
})

const botApiService = {
  getAvatar: async (telegramId: number): Promise<string> => {
    try {
      const response = await api.post<{ data: string }>('/getAvatar', { telegramId })

      const avatarUrl = response?.data?.data

      if (isDev()) {
        return avatarUrl
      }

      if (avatarUrl === undefined) {
        return ''
      }

      const imageResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' })

      const fileName = `${telegramId}.jpg`
      const filePath = path.resolve('/app/uploads', fileName)

      await fs.writeFile(filePath, imageResponse.data)

      return `/files/${fileName}`
    } catch (error) {
      logger.error(error)

      return ''
    }
  },

  sendNotification: async (data: NotificationData): Promise<boolean> => {
    try {
      const response = await api.post<{ data: boolean }>('/notification', data)

      return response?.data?.data
    } catch (error) {
      logger.error(error)

      return false
    }
  }
}

export { botApiService }
