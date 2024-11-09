import { config } from '../lib'

export const isDev = (): boolean => {
  return config.ENV_MODE === 'dev'
}
