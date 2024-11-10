export interface InitDataPayload {
  user?: {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
    is_premium?: boolean
  }
  chat_instance?: string
  start_param?: string
}
