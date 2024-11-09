import { z } from 'zod'
import mongoose from 'mongoose'

export const getGiftSchema = z.object({
  query: z.object({
    id: z.string({
      message: 'Id is required'
    }).refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})

export type GetGift = z.infer<typeof getGiftSchema>['query']
