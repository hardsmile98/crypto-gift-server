export interface IPayment {
  _id: string
  userId: string
  giftId: string
  status: 'active' | 'processed'
  invoiceId: number
  createAt: number
}

export interface IPaymentWebhook {
  invoice_id: number
  status: 'active' | 'paid' | 'expired'
  hash: string
  asset: string
  amount: string
  fee: string
  fee_asset: string
  paid_anonymously: boolean
  paid_btn_name?: string
  paid_btn_url?: string
  comment?: string
  payload?: string
  paid_at?: string
  created_at: string
  expiration_date?: string
}

export interface IWebhookUpdate {
  update_id: number
  update_type: 'invoice_paid'
  request_date: string
  payload: IPaymentWebhook
}
