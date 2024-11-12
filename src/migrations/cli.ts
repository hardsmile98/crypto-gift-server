import { mongoMigrateCli } from 'mongo-migrate-ts'
import { config } from '../libs'

mongoMigrateCli({
  uri: config.MONGO_DATABASE_URL,
  database: config.MONGO_DATABASE_NAME,
  migrationsDir: __dirname
})
