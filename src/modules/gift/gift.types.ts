export interface IGift {
  _id: string
  name: string
  description: string
  price: number
  imageUrl: string
  available: number
  maxAvailable: number
  bgColor: string
  currency: 'USDT' | 'TON' | 'ETH'
}
