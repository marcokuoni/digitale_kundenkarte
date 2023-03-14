import mongoose from 'mongoose'

export const connectMongoDb = function () {
  const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB,
  } = process.env

  const options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    connectTimeoutMS: 10000,
    auto_reconnect: true,
    useUnifiedTopology: true,
  }

  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

  mongoose.Promise = global.Promise
  mongoose.set('strictQuery', false)
  mongoose
    .connect(url, options)
    .then(function () {
      console.log('MongoDB is connected')
    })
    .catch(function (err) {
      console.log(err)
    })
}
