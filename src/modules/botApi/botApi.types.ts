export interface NotificationData {
  telegramId: bigint
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
