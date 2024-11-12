
export enum PaymentStatuses {
  active = 'active',
  processed = 'processed'
}
export interface IPayment {
  _id: string
  userId: string
  giftId: string
  status: PaymentStatuses
  invoiceId: number
  createAt: number
}

export enum PaymentWebhookStatuses {
  active = 'active',
  paid = 'paid',
  expired = 'expired'
}

export interface IPaymentWebhook {
  invoice_id: number
  status: PaymentWebhookStatuses
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

export enum UpdateTypes {
  invoicePaid = 'invoice_paid'
}

export interface IWebhookUpdate {
  update_id: number
  update_type: UpdateTypes
  request_date: string
  payload: IPaymentWebhook
}
