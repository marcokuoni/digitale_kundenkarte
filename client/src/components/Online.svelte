<script lang="ts">
  import Icon from 'svelte-icons-pack/Icon.svelte'
  import Wifi from 'svelte-icons-pack/bi/BiWifi'
  import WifiOff from 'svelte-icons-pack/bi/BiWifiOff'
  import { onMount } from 'svelte'
  import Modal, { getModal } from './Modal.svelte'

  const clientPingIntervall = 5000 //TODO: Go in Settings
  const serverRequestCountCheckIntervall = 1000 //TODO: Go in Settings
  const checkForHowManyCycles = 600 //TODO: Go in Settings
  let checkCounter = 0
  let clientOffline = window.navigator.onLine
  let serverOffline = false
  let queuedRequestSize = 0
  let db = null
  const DBOpenRequest = window.indexedDB.open('workbox-background-sync')

  onMount(async () => {
    pingClientRecursive()
  })

  window.addEventListener('offline', () => {
    clientOffline = true
  })

  window.addEventListener('online', () => {
    clientOffline = false
  })

  window.addEventListener('apolloError', () => {
    serverOffline = true
    checkCounter = 0
    checkRequestCountRecursive()
  })

  DBOpenRequest.onsuccess = (event) => {
    db = DBOpenRequest.result
    checkRequestCountRecursive()
  }

  async function pingClientRecursive() {
    pingClient()
    setTimeout(() => {
      pingClientRecursive()
    }, clientPingIntervall)
  }

  async function checkRequestCountRecursive() {
    checkQueuedRequestCount()
    setTimeout(() => {
      if (queuedRequestSize > 0 && checkCounter < checkForHowManyCycles) {
        checkCounter++
        checkRequestCountRecursive()
      }
    }, serverRequestCountCheckIntervall)
  }

  async function checkQueuedRequestCount() {
    if (db && db.objectStoreNames.contains('requests')) {
      const transaction = db.transaction(['requests'], 'readonly')
      if (transaction) {
        const objectStore = transaction.objectStore('requests')
        const myIndex = objectStore.index('queueName')
        const countRequest = myIndex.count()
        countRequest.onsuccess = () => {
          queuedRequestSize = countRequest.result || 0
          serverOffline = queuedRequestSize > 0
        }
      }
    }
  }

  async function pingClient() {
    fetch('/favicon.png?d=' + Date.now())
      .then((response) => {
        if (!response.ok) {
          clientOffline = true
        } else {
          clientOffline = false
        }
      })
      .catch((error) => {
        clientOffline = true
      })
  }
</script>

<button class="btn" on:click={() => getModal().open()}>
  <Icon
    className="icon"
    src={!clientOffline && !serverOffline ? Wifi : WifiOff}
  />
</button>
<Modal>
  <ul>
    <li>
      <span>Applikation ist {clientOffline ? 'offline' : 'online'}</span>
    </li>
    <li>
      <span>API-Server ist {serverOffline ? 'offline' : 'online'}</span>
    </li>
    {#if queuedRequestSize > 0}
      <li>
        <span>Serveranfragen im Warteraum: {queuedRequestSize}</span>
      </li>
    {/if}
  </ul>
</Modal>

<style>
  :global(.icon) {
    width: 24px;
    height: 24px;
    fill: var(--secondary-color);
  }

  .btn {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  ul li span {
    font-size: 11pt;
    line-height: 1.2;
    color: var(--foreground-color);
  }
</style>
