import z from 'zod'

export const createUserSchema = z.object({
  body: z.object({
    telegramId: z.string({
      message: 'Id is required'
    })
  })
})
