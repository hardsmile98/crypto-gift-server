
import { type Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { logger } from '@/lib'
import { userSevice } from './user.service'
import { type IContextRequest } from '@/types'
import { type GetProfile } from './user.schema'

const userController = {
  getLeaderboard: async (
    _req: IContextRequest,
    res: Response
  ): Promise<void> => {
    try {
      const leaderboard = await userSevice.getLeaderboard(100)

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: leaderboard
      })
    } catch (error) {
      logger.error(error)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  },

  getProfile: async (
    req: IContextRequest<unknown, unknown, unknown, GetProfile>,
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

      const queryId = req.query.id
      const id = queryId ?? userId

      const user = await userSevice.getUserById(id)

      if (user === null) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'User not found'
        })

        return
      }

      const position = await userSevice.getPosition(user)

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: {
          user,
          isMyProfile: id === userId,
          position
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

export { userController }
