import App from './App.svelte'
import { initPersistor } from './apollo-client'

;(async () => {
  if ('serviceWorker' in navigator) {
    const { Workbox } = await import('workbox-window')

    const wb = new Workbox('/sw.js')
    wb.register()
  }

  await initPersistor()

  new App({
    target: document.body,
  })
})()