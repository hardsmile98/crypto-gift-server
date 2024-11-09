import type { IPayment } from './payment.types'
import { Payment } from './payment.model'
import { type UpdateQuery } from 'mongoose'

const paymentRepository = {
  createPayment: async (data: Partial<IPayment>): Promise<IPayment> => {
    const user = await Payment.create(data)
    return user
  },

  findPaymentById: async (id: string): Promise<IPayment | null> => {
    return await Payment.findById(id)
  },

  findPaymentByInvoiceId: async (invoiceId: number): Promise<IPayment | null> => {
    return await Payment.findOne({ invoiceId })
  },

  updatePayment: async (id: string, update: UpdateQuery<IPayment>): Promise<IPayment | null> => {
    return await Payment.findOneAndUpdate(
      { _id: id },
      { ...update },
      { new: true }
    )
  }
}

export { paymentRepository }
