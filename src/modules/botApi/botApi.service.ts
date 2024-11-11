import axios from 'axios'
import { config, logger } from '@/lib'
import { type NotificationData } from './botApi.types'

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

      return response?.data?.data
    } catch (error) {
      logger.error(error)

      return ''
    }
  },

  orderNotification: async (data: NotificationData): Promise<boolean> => {
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
