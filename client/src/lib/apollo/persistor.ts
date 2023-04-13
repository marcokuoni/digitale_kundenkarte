import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist'

//NOTE deactivate local storage cache
const persistor = new CachePersistor({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
})
// /NOTE deactivate local storage cache

import cache from './cache'

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
