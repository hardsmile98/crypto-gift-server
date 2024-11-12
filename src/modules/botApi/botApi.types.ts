import { type OrderActions } from '../order'

export interface NotificationData {
  telegramId: number
  action: OrderActions
  orderDetail: {
    gift: string
    to?: {
      firstName: string
    }
    from?: {
      firstName: string
    }
  }
}
