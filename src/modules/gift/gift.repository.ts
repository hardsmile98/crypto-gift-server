import type { IGift } from './gift.types'
import { Gift } from './gift.model'
import { type UpdateQuery } from 'mongoose'

const giftRepository = {
  findGifts: async (): Promise<IGift[]> => {
    const gifts = await Gift.find()
    return gifts
  },

  findGiftById: async (id: string): Promise<IGift | null> => {
    const gift = await Gift.findById(id)
    return gift
  },

  updateGift: async (id: string, update: UpdateQuery<IGift>): Promise<void> => {
    await Gift.updateOne(
      { _id: id },
      { ...update },
      { new: true }
    )
  }
}

export { giftRepository }
