import CryptoBotAPI from 'crypto-bot-api'
import { config } from '@/libs'
import { isDev } from '@/utils'
import { paymentRepository } from './payment.repository'
import { orderService, type IWebhookUpdate, type IGift, PaymentStatuses, PaymentWebhookStatuses, UpdateTypes } from '@/modules'

const cryptoBotAPI = new CryptoBotAPI(config.CRYPTO_BOT_API_TOKEN, isDev()
  ? 'testnet'
  : 'mainnet')

const paymentService = {
  createInvoice: async ({ userId, gift }: { userId: string, gift: IGift }) => {
    const newPayment = await paymentRepository.createPayment({
      userId,
      giftId: gift._id
    })

    const invoice = await cryptoBotAPI.createInvoice({
      asset: gift.currency,
      amount: gift.price.toString(),
      description: `Purchasing a ${gift.name} gift`,
      paidBtnName: 'callback',
      paidBtnUrl: `${config.MINIAPP_URL}?startapp=purchase_${newPayment._id}`,
      hiddenMessage: 'Thanks for your purchase!',
      expiresIn: 3600
    })

    await paymentRepository.updatePayment(newPayment._id, {
      invoiceId: invoice.id
    })

    return invoice
  },

  updateProcessing: async (update: IWebhookUpdate) => {
    if (update === undefined) {
      return false
    }

    const payment = await paymentRepository.findPaymentByInvoiceId(update.payload.invoice_id)

    if (payment === null || payment.status !== PaymentStatuses.active) {
      return false
    }

    if (update.payload.status !== PaymentWebhookStatuses.paid) {
      return false
    }

    switch (update.update_type) {
      case UpdateTypes.invoicePaid: {
        await orderService.purchaseGift(payment)

        await paymentRepository.updatePayment(payment._id, {
          status: PaymentStatuses.processed
        })

        return true
      }

      default:
        break
    }
  }
}

export { paymentService }
