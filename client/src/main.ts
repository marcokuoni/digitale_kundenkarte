import App from './App.svelte'
import { initPersistor } from './apollo-client'
;(async () => {
  await initPersistor()

  new App({
    target: document.body,
  })
})()
