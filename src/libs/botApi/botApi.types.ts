import { type OrderActions } from '../../modules/order'

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
