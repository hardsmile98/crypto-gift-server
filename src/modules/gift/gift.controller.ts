import { type Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { logger } from '@/libs'
import { type IContextRequest } from '@/types'
import { giftSevice } from './gift.service'
import { type GetGift } from './gift.schema'

const giftController = {
  getGifts: async (
    _req: IContextRequest,
    res: Response
  ): Promise<void> => {
    try {
      const gifts = await giftSevice.getGifts()

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: gifts
      })
    } catch (error) {
      logger.error(error)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  },

  getGiftById: async (
    req: IContextRequest<unknown, unknown, unknown, GetGift>,
    res: Response
  ): Promise<void> => {
    try {
      const id = req.query.id

      const gift = await giftSevice.getGift(id)

      if (gift === null) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          mesage: 'Gift is not found!'
        })

        return
      }

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: gift
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

export { giftController }
