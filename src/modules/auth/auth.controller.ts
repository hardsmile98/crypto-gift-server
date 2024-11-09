import { type Request, type Response } from 'express'
import { type LoginType } from './auth.schema'
import { authServices } from './auth.service'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { logger } from '../../lib'
import { isDev } from '../../utils'
import { userSevice } from '../user'

const authController = {
  getToken: async (
    req: Request<unknown, unknown, LoginType>,
    res: Response
  ): Promise<void> => {
    try {
      const initData = req.body.initData

      if (!authServices.verifyInitData(initData) && !isDev()) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Error in verify initData'
        })

        return
      }

      const initDataParsed = authServices.transformInitData(initData)

      if (initDataParsed?.user === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Error in parse initData'
        })

        return
      }

      let user = await userSevice.getUserByTelegramId(initDataParsed.user.id)

      if (user === null) {
        const newUserData = {
          telegramId: initDataParsed.user.id,
          isPremium: initDataParsed.user.is_premium,
          firstName: initDataParsed.user.first_name,
          lastName: initDataParsed.user.last_name,
          languageCode: initDataParsed.user.language_code,
          username: initDataParsed.user.username
        }

        user = await userSevice.createUser(newUserData)
      }

      const jwtToken = authServices.generateToken(user._id)

      res.cookie('authToken', jwtToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true
      })
        .status(StatusCodes.OK)
        .json({ status: StatusCodes.OK })
    } catch (error) {
      logger.error(error)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  }
}

export { authController }
