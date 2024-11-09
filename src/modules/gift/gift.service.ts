import { giftRepository } from './gift.repository'
import { type IGift } from './gift.types'

const giftSevice = {
  getGifts: async (): Promise<IGift[]> => {
    const gifts = await giftRepository.findGifts()
    return gifts
  },

  getGift: async (id: string): Promise<IGift | null> => {
    const gift = await giftRepository.findGiftById(id)
    return gift
  },

  decreaseAvailable: async (id: string): Promise<boolean> => {
    const gift = await giftRepository.findGiftById(id)

    if (gift == null) {
      return false
    }

    if (gift.available === 0) {
      return false
    }

    const newAvailable = gift.available - 1

    await giftRepository.updateGift(id, { available: newAvailable })

    return true
  }
}

export { giftSevice }
