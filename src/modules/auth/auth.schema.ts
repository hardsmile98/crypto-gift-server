import { z } from 'zod'

export const getTokenSchema = z.object({
  body: z.object({
    initData: z.string({
      message: 'initData is required'
    })
  })
})

export type LoginType = z.infer<typeof getTokenSchema>['body']
