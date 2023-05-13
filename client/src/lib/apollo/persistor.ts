import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist'
import cache from './cache'
import { PROCESS_ENV } from '../const'

//NOTE deactivate local storage cache
const persistor = new CachePersistor({
  cache,
  debug: true,
  storage: new LocalStorageWrapper(window.localStorage),
})
// /NOTE deactivate local storage cache


const currentVersion = window.localStorage.getItem(
  PROCESS_ENV.SCHEMA_VERSION_KEY
)

export default async () => {
  //NOTE deactivate local storage cache
  if (currentVersion === PROCESS_ENV.SCHEMA_VERSION) {
    await persistor.restore()
  } else {
    await purge()
  }
  // /NOTE deactivate local storage cache
}

export const purge = async () => {
  await persistor.purge()
  window.localStorage.setItem(
    PROCESS_ENV.SCHEMA_VERSION_KEY,
    PROCESS_ENV.SCHEMA_VERSION
  )
}

export const updatePersistCache = async () => {
  await persistor.persist()
  await persistor.restore()
}