import App from './App.svelte'
import { initPersistor } from './apollo-client'
;(async () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      const { Workbox } = await import('workbox-window')

      const wb = new Workbox('/sw.js')

      const showSkipWaitingPrompt = async (event) => {
        wb.addEventListener('controlling', () => {
          window.location.reload()
        })

        //TODO: Make this nice looking
        const updateAccepted = await new Promise((resolve) => {
          resolve(confirm('soll die App ein Update erfahren?'))
        })

        if (updateAccepted) {
          wb.messageSkipWaiting()
        }
      }

      wb.addEventListener('waiting', (event) => {
        showSkipWaitingPrompt(event)
      })

      //NOTE deactivate local storage cache
      wb.register()
      // /NOTE deactivate local storage cache
    })
  }

  await initPersistor()

  new App({
    target: document.body,
  })
})()
