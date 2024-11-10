import { z } from 'zod'
import mongoose from 'mongoose'
import { EnumOrderStatus } from './order.type'

export const getOrderByPaymentIdSchema = z.object({
  query: z.object({
    paymentId: z.string({
      message: 'paymentId is required'
    }).refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})

export const getOrderById = z.object({
  query: z.object({
    id: z.string({
      message: 'Id is required'
    }).refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})

export const getReceivedOrders = z.object({
  query: z.object({
    id: z.string({
      message: 'Id is required'
    }).refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})

export const getOrdersByStatusSchema = z.object({
  query: z.object({
    status: z.nativeEnum(EnumOrderStatus)
  })
})

export const getGiftHistorySchema = z.object({
  query: z.object({
    giftId: z.string({
      message: 'giftId is required'
    }).refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})

export const buyGiftSchema = z.object({
  body: z.object({
    id: z.string({
      message: 'Id is required'
    }).refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})

export const receiveGiftSchema = z.object({
  body: z.object({
    id: z.string({
      message: 'Id is required'
    }).refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    }),
    hash: z.string({
      message: 'Hash is required'
    }).min(64)
  })
})

export type ReceiveGift = z.infer<typeof receiveGiftSchema>['body']
export type BuyGift = z.infer<typeof buyGiftSchema>['body']
export type GetReceivedOrders = z.infer<typeof getReceivedOrders>['query']
export type GetOrderById = z.infer<typeof getOrderById>['query']
export type GetGiftHistory = z.infer<typeof getGiftHistorySchema>['query']
export type GetOrderByPaymentId = z.infer<typeof getOrderByPaymentIdSchema>['query']
export type GetOrdersByStatus = z.infer<typeof getOrdersByStatusSchema>['query']
