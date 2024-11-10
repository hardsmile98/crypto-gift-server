import * as crypto from 'crypto'
import { config } from '../lib'

export const isDev = (): boolean => {
  return config.ENV_MODE === 'dev'
}

export const generateRandomHash = (bytes = 16): string => {
  return crypto.randomBytes(bytes).toString('hex')
}
