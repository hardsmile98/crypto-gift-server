import * as crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { config } from '@/lib'
import { type InitDataPayload } from './auth.types'

const authServices = {
  verifyInitData: (telegramInitData: string): boolean => {
    const initData = new URLSearchParams(telegramInitData)
    const hashFromClient = initData.get('hash')
    const dataToCheck: string[] = []

    initData.sort()
    initData.forEach((v, k) => k !== 'hash' && dataToCheck.push(`${k}=${v}`))

    const secret = crypto
      .createHmac('sha256', 'WebAppData')
      .update(config.TELEGRAM_BOT_TOKEN)

    const signature = crypto
      .createHmac('sha256', secret.digest())
      .update(dataToCheck.join('\n'))

    const referenceHash = signature.digest('hex')

    return hashFromClient === referenceHash
  },

  transformInitData: (telegramInitData: string) => {
    try {
      const data = Object.fromEntries(new URLSearchParams(telegramInitData))

      const user = JSON.parse(data.user) as InitDataPayload['user']

      return {
        ...data,
        user
      }
    } catch (e) {
      return undefined
    }
  },

  generateToken: (id: string): string => {
    return jwt.sign({ id }, config.JWT_SECRET, { expiresIn: '24h' })
  },

  jwtVerify: ({ accessToken }: { accessToken: string }) => {
    return jwt.verify(accessToken, config.JWT_SECRET) as { id: string }
  }
}

export { authServices }
