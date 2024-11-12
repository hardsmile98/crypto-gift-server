import { type Request, type Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { logger } from '@/libs'
import { type IWebhookUpdate } from './payment.types'
import { paymentService } from './payment.service'

const paymentController = {
  getUpdates: async (
    req: Request<unknown, unknown, IWebhookUpdate>,
    res: Response
  ): Promise<void> => {
    try {
      const isProcessed = await paymentService.updateProcessing(req.body)

      if (isProcessed === false) {
        logger.warn('Webhook update not processed')

        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: ReasonPhrases.BAD_REQUEST
        })

        return
      }

      res.status(StatusCodes.OK).json({ status: StatusCodes.OK })
    } catch (error) {
      logger.error(error)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  }
}

export { paymentController }
