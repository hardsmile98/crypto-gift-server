import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from '@/lib'
import { rootRouter } from '@/routes'
import {
  extractJwtMiddleware,
  requestLoggerMiddleware
} from './middlewares'
import { StatusCodes } from 'http-status-codes'

const app = express()

app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(requestLoggerMiddleware)

const allowedOrigins = config.CLIENT_URL

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['*']
}))

app.use(extractJwtMiddleware)

app.use('/api', rootRouter)

app.use((_req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: StatusCodes.NOT_FOUND,
    message: 'Route is not found!'
  })
})

export { app }
