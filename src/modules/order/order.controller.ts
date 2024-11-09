import { type Response } from 'express'
import { type IContextRequest } from '../../types'
import {
  type GetOrdersByStatus,
  type GetOrderByPaymentId,
  type GetOrderById,
  type BuyGift,
  type GetGiftHistory,
  type GetReceivedOrders
} from './order.schema'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { logger } from '../../lib'
import { orderService } from './order.service'
import { giftSevice, paymentService, userSevice } from '../index'

const orderController = {
  getOrderByPaymentId: async (
    req: IContextRequest<unknown, unknown, unknown, GetOrderByPaymentId>,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.context?.userId

      const order = await orderService.getOrderByPaymentId(req.query.paymentId)

      if (order === null) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Order is not found'
        })

        return
      }

      if (typeof order.userId === 'object' && order.userId._id.toString() !== userId) {
        res.status(StatusCodes.FORBIDDEN).json({
          status: StatusCodes.FORBIDDEN,
          message: ReasonPhrases.FORBIDDEN
        })

        return
      }

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: order
      })
    } catch (error) {
      logger.error(error)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  },

  getOrdersByStatus: async (
    req: IContextRequest<unknown, unknown, unknown, GetOrdersByStatus>,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.context?.userId

      if (userId === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'User is not found'
        })

        return
      }

      const orders = await orderService.getOrdersByStatus(req.query.status, userId)

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: orders
      })
    } catch (error) {
      logger.error(error)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  },

  getGiftHistory: async (
    req: IContextRequest<unknown, unknown, unknown, GetGiftHistory>,
    res: Response
  ): Promise<void> => {
    try {
      const orders = await orderService.getGiftHistory(req.query.giftId, 10)

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: orders
      })
    } catch (error) {
      logger.error(error)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  },

  getOrdersById: async (
    req: IContextRequest<unknown, unknown, unknown, GetOrderById>,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.context?.userId

      const order = await orderService.getOrderById(req.query.id)

      if (order === null) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Order is not found'
        })

        return
      }

      if (typeof order.userId === 'object' && order.userId._id.toString() !== userId) {
        res.status(StatusCodes.FORBIDDEN).json({
          status: StatusCodes.FORBIDDEN,
          message: ReasonPhrases.FORBIDDEN
        })

        return
      }

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: order
      })
    } catch (error) {
      logger.error(error)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  },

  getOrdersReceivedByUser: async (
    req: IContextRequest<unknown, unknown, unknown, GetReceivedOrders>,
    res: Response
  ) => {
    try {
      const userId = req.query.id

      const orders = await orderService.getOrdersReceivedByUser(userId)

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: orders
      })
    } catch (error) {
      logger.error(error)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  },

  getOrderHistory: async (
    req: IContextRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.context?.userId

      if (userId === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'User is not found'
        })

        return
      }

      const history = await orderService.getOrderHistory(userId)

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: history
      })
    } catch (error) {
      logger.error(error)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  },

  buyGift: async (
    req: IContextRequest<unknown, unknown, BuyGift>,
    res: Response
  ) => {
    try {
      const { id } = req.body
      const userId = req.context?.userId

      if (userId === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'User is not found'
        })

        return
      }

      const giftFinded = await giftSevice.getGift(id)

      if (giftFinded === null) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Gift is not found'
        })

        return
      }

      if (giftFinded.available <= 0) {
        res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          message: 'The gifts are over'
        })

        return
      }

      const userFinded = await userSevice.getUserById(userId)

      if (userFinded === null) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'User is not found'
        })

        return
      }

      const payment = await paymentService.createInvoice({
        userId: userFinded._id,
        gift: giftFinded
      })

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: payment
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

export { orderController }