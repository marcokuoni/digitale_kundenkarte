import { startupServer } from './server'
import { connectMongoDb } from './db'

;(async () => {
  await connectMongoDb()
  startupServer()
})()
