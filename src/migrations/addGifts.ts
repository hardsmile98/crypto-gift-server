import { type MigrationInterface } from 'mongo-migrate-ts'
import { type Db, type MongoClient } from 'mongodb'

export class AddGifts implements MigrationInterface {
  async up (db: Db, _client: MongoClient): Promise<void | never> {
    const Gift = db.collection('gifts')

    await Gift.insertOne(
      {
        name: 'Delicious Cake',
        description: 'Purchase this gift for the opportunity to give it to another user.',
        price: 5,
        currency: 'USDT',
        slug: 'delicious-cake',
        maxAvailable: 1000,
        available: 1000
      }
    )

    await Gift.insertOne(
      {
        name: 'Green Star',
        description: 'Purchase this gift for the opportunity to give it to another user.',
        price: 0.1,
        currency: 'TON',
        slug: 'green-star',
        maxAvailable: 2000,
        available: 2000
      }
    )

    await Gift.insertOne(
      {
        name: 'Blue Star',
        description: 'Purchase this gift for the opportunity to give it to another user.',
        price: 0.01,
        currency: 'ETH',
        slug: 'blue-star',
        maxAvailable: 5000,
        available: 5000
      }
    )
  }

  async down (db: Db, client: MongoClient): Promise<void | never> {
    await db.dropCollection('gifts')
  }
}
