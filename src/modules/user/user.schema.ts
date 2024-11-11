import { z } from 'zod'
import mongoose from 'mongoose'

export const getProfileSchema = z.object({
  query: z.object({
    userId: z.string({
      message: 'userId is required'
    }).refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    }).optional()
  })
})

export type GetProfile = z.infer<typeof getProfileSchema>['query']
