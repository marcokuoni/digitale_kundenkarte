import App from './App.svelte'
import { initPersistor } from './apollo-client'

;(async () => {
  if ('serviceWorker' in navigator) {
    const { Workbox } = await import('workbox-window')

    const wb = new Workbox('/sw.js')

    const showSkipWaitingPrompt = async (event) => {
      wb.addEventListener('controlling', () => {
        window.location.reload();
      });

      //TODO: Make this nice looking
      const updateAccepted = await new Promise((resolve) => {
        resolve(confirm("soll die App ein Update erfahren?"))
      })

      if (updateAccepted) {
        wb.messageSkipWaiting();
      }
    };

    wb.addEventListener('waiting', (event) => {
      showSkipWaitingPrompt(event);
    });
    wb.register()
  }

  await initPersistor()

  new App({
    target: document.body,
  })
})()