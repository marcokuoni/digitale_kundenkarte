import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist'
import cache from './cache'

//NOTE deactivate local storage cache
const persistor = new CachePersistor({
  cache,
  debug: true,
  storage: new LocalStorageWrapper(window.localStorage),
})
// /NOTE deactivate local storage cache


const currentVersion = window.localStorage.getItem(
  'process.env.SCHEMA_VERSION_KEY'
)

export default async () => {
  //NOTE deactivate local storage cache
  if (currentVersion === 'process.env.SCHEMA_VERSION') {
    await persistor.restore()
  } else {
    await purge()
  }
  // /NOTE deactivate local storage cache
}

export const purge = async () => {
  await persistor.purge()
  window.localStorage.setItem(
    'process.env.SCHEMA_VERSION_KEY',
    'process.env.SCHEMA_VERSION'
  )
}

export const updatePersistCache = async () => {
  await persistor.persist()
  await persistor.restore()
}