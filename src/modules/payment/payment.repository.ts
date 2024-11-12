import { type UpdateQuery } from 'mongoose'
import type { IPayment } from './payment.types'
import { Payment } from './payment.model'

const paymentRepository = {
  createPayment: async (data: Partial<IPayment>) => {
    const user = await Payment.create(data)

    return user
  },

  findPaymentById: async (id: string) => {
    return await Payment.findById(id).lean()
  },

  findPaymentByInvoiceId: async (invoiceId: number) => {
    return await Payment.findOne({ invoiceId }).lean()
  },

  updatePayment: async (id: string, update: UpdateQuery<IPayment>) => {
    return await Payment.findOneAndUpdate(
      { _id: id },
      { ...update },
      { new: true }
    ).lean()
  }
}

export { paymentRepository }
