import { Router } from 'express'
import { botController } from './bot.controller'
import { config } from '../../lib'
import { validateRequest } from '../../middlewares'
import { getOrderSchema } from './bot.schema'

const botRouter = Router()

botRouter.get(
    `/bot/${config.TELEGRAM_BOT_TOKEN}/getOrder`,
    validateRequest(getOrderSchema),
    botController.getOrder)

export { botRouter }
