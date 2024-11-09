import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const configSchema = z.object({
  ENV_MODE: z.string(),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  MONGO_DATABASE_URL: z.string(),
  MONGO_DATABASE_NAME: z.string(),
  CLIENT_URL: z.string(),
  JWT_SECRET: z.string(),
  TELEGRAM_BOT_TOKEN: z.string(),
  CRYPTO_BOT_API_TOKEN: z.string()
})

export type Config = z.infer<typeof configSchema>

const config = configSchema.parse(process.env)

export { config }
