import CryptoBotAPI from 'crypto-bot-api'
import { config } from '../../lib'
import { paymentRepository } from './payment.repository'
import { isDev } from '../../utils'
import { type IWebhookUpdate, type IGift } from '../index'
import { orderService } from '../index'

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
      paidBtnName: 'callback',
      paidBtnUrl: `${config.MINIAPP_URL}?startapp=order_${newPayment._id}`,
      hiddenMessage: 'Спасибо за покупку!',
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

    if (payment === null || payment.status !== 'active') {
      return false
    }

    if (update.payload.status !== 'paid') {
      return false
    }

    switch (update.update_type) {
      case 'invoice_paid': {
        await orderService.purchaseGift(payment)

        await paymentRepository.updatePayment(payment._id, {
          status: 'processed'
        })

        return true
      }

      default:
        break
    }
  }
}

export { paymentService }
