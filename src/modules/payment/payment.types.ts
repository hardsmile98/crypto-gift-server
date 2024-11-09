import { type Invoice } from 'crypto-bot-api'

export interface IPayment {
  _id: string
  userId: string
  giftId: string
  status: 'active' | 'processed'
  invoiceId: number
  createAt: number
}

export interface IWebhookUpdate {
  update_id: number
  update_type: 'invoice_paid'
  request_date: string
  payload: Invoice
}
