import 'dotenv/config'
import { app } from './app'
import { config, connectDatabase } from './lib'

async function bootsrap (): Promise<void> {
  try {
    await connectDatabase()

    const port = config.PORT

    app.listen(port, () => {
      console.log(`🚀 Сервер запущен на ${port} порту`)
    })
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error)
    process.exit(1)
  }
}

void bootsrap()
