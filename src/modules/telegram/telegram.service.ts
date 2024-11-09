import axios from 'axios'
import { config } from '../../lib'

const telegramApiBaseUrl = 'https://api.telegram.org'

const telegramService = {
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

export { telegramService }
