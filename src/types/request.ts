import { type Request } from 'express'

export interface IContextRequest<
  P = unknown,
  ResBody = unknown,
  ReqBody = unknown,
  Query = unknown
> extends Request<P, ResBody, ReqBody, Query> {
  context?: {
    userId: string
  }
}
