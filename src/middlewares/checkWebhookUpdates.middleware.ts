import { type NextFunction, type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as crypto from 'crypto'
import { logger, config } from '@/lib'

export const checkWebhookUpdates = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const signature = req.headers['crypto-pay-api-signature']

    const secret = crypto.createHash('sha256').update(config.CRYPTO_BOT_API_TOKEN).digest()
    const checkString = JSON.stringify(req.body)
    const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex')

    if (signature !== hmac) {
      logger.error('Singnature in webhook invalid')

      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: 'Singnature in webhook invalid'
      })

      return
    }

    next()
  } catch (error) {
    logger.error(error)

    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: 'Error check updates in webhook'
    })
  }
}
