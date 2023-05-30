import App from './App.svelte'
import { PROCESS_ENV } from './lib/const'
import initPersistor from './services/apollo/persistor'
;(async () => {
  window.addEventListener('load', async () => {
    if ('serviceWorker' in navigator) {
      const { Workbox } = await import('workbox-window')

      const wb = new Workbox('/sw.js')

      const showSkipWaitingPrompt = async () => {
        wb.addEventListener('controlling', () => {
          window.location.reload()
        })

        //TODO: Make this nice looking
        const updateAccepted = await new Promise((resolve) => {
          // resolve(true)
          resolve(confirm('soll die App ein Update erfahren?'))
        })

        if (updateAccepted) {
          wb.messageSkipWaiting()
        }
      }

      wb.addEventListener('waiting', () => {
        showSkipWaitingPrompt()
      })

      //NOTE deactivate local storage cache
      wb.register().then((reg) => {
        setInterval(function () {
          reg.update()
        }, parseInt(PROCESS_ENV.CLIENT_PING_INTERVAL || '5000'))
      })
      // /NOTE deactivate local storage cache
    }
  })

  await initPersistor()

  new App({
    target: document.body,
  })
})()
