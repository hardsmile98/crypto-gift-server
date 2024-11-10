import mongoose from 'mongoose'
import z from 'zod'

export const getOrderSchema = z.object({
  query: z.object({
    telegramId: z.string({
      message: 'telegramId is required'
    }),
    orderId: z.string({
      message: 'orderId is required'
    }).refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})

export type GetOrder = z.infer<typeof getOrderSchema>['query']
