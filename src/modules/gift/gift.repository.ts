import type { IGift } from './gift.types'
import { Gift } from './gift.model'
import { type UpdateQuery } from 'mongoose'

const giftRepository = {
  findGifts: async (): Promise<IGift[]> => {
    const gifts = await Gift.find().lean()

    return gifts
  },

  findGiftById: async (id: string) => {
    const gift = await Gift.findById(id).lean()

    return gift
  },

  updateGift: async (id: string, update: UpdateQuery<IGift>) => {
    await Gift.updateOne(
      { _id: id },
      { ...update },
      { new: true }
    )
  }
}

export { giftRepository }
