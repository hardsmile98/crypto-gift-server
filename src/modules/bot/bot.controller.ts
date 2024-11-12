import { type Request, type Response } from 'express'
import { type GetOrder } from './bot.schema'
import { orderService, OrderStatuses } from '@/modules'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { logger } from '@/libs'

const botController = {
  getOrder: async (
    req: Request<unknown, unknown, unknown, GetOrder>,
    res: Response
  ): Promise<void> => {
    try {
      const orderId = req.query.orderId
      const telegramId = +req.query.telegramId

      const order = await orderService.getExtendOrderById(orderId)

      if (order === null) {
        res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          data: null
        })

        return
      }

      if (order.userId.telegramId !== telegramId || order.status !== OrderStatuses.purchased) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          data: 'Invalid order query'
        })

        return
      }

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: {
          hash: order.hash,
          id: order._id,
          gift: order.giftId?.name
        }
      })
    } catch (error) {
      logger.error(error)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  }
}

export { botController }
