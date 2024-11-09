export interface IUser {
  _id: string
  telegramId: bigint
  firstName: string
  lastName?: string
  username?: string
  languageCode?: string
  isPremium?: boolean
  giftsReceived: number
  giftsSent: number
  createdAt: string
  avatar: string
}
