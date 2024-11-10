export interface NotificationData {
  telegramId: number
  action: 'purchase' | 'send' | 'receive'
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
