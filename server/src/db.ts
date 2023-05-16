import mongoose from 'mongoose'

export const connectMongoDb = async function () {
  const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB,
  } = process.env

  const options = {
    useNewUrlParser: true,
    connectTimeoutMS: 10000,
    useUnifiedTopology: true,
  }

  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

  mongoose.Promise = global.Promise
  mongoose.set('strictQuery', false)
  try {
    await mongoose.connect(url, options)
  } catch (e) {
    console.error(e)
  }
  console.log('MongoDB is connected')
}
