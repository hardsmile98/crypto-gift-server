import { z } from 'zod'
import mongoose from 'mongoose'

export const getProfileSchema = z.object({
  query: z.object({
    id: z.string({
      message: 'Id is required'
    }).refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    }).optional()
  })
})

export type GetProfile = z.infer<typeof getProfileSchema>['query']
