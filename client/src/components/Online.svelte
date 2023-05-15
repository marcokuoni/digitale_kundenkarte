<script lang="ts">
  import Icon from 'svelte-icons-pack/Icon.svelte'
  import Wifi from 'svelte-icons-pack/bi/BiWifi'
  import WifiOff from 'svelte-icons-pack/bi/BiWifiOff'
  import { onDestroy, onMount } from 'svelte'
  import Modal, { getModal } from './Modal.svelte'
  import { EVENTS, PROCESS_ENV } from '../lib/const'
  import currentUser from '../stores/currentUser'

  const clientPingIntervall = parseInt(
    PROCESS_ENV.CLIENT_PING_INTERVAL || '5000'
  )
  const serverRequestCountCheckIntervall = parseInt(
    PROCESS_ENV.SERVER_REQUEST_COUNT_CHECK_INTERVAL || '1000'
  )
  const checkForHowManyCycles = parseInt(
    PROCESS_ENV.CHECK_FOR_HOW_MANY_CYCLES || '600'
  )
  const REQUESTS = 'requests'
  const READONLY = 'readonly'
  const QUEUE_NAME = 'queueName'

  let checkCounter = 0
  let clientOffline = window.navigator.onLine
  let serverOffline = false
  let queuedRequestSize = 0
  let db = null
  const DBOpenRequest = window.indexedDB.open('workbox-background-sync')

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
    if (db && db.objectStoreNames.contains(REQUESTS)) {
      const transaction = db.transaction([REQUESTS], READONLY)
      if (transaction) {
        const objectStore = transaction.objectStore(REQUESTS)
        const myIndex = objectStore.index(QUEUE_NAME)
        const countRequest = myIndex.count()
        countRequest.onsuccess = () => {
          queuedRequestSize = countRequest.result || 0
          serverOffline = queuedRequestSize > 0
          if(!serverOffline) {
            currentUser.fetchCurrentUser()
          }
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

  const offlineHander = () => {
    clientOffline = true
  }

  const onlineHandler = () => {
    clientOffline = false
  }

  const serverOfflineHandler = () => {
    serverOffline = true
    checkCounter = 0
    checkRequestCountRecursive()
  }

  onMount(async () => {
    pingClientRecursive()
  })

  window.addEventListener(EVENTS.OFFLINE, offlineHander)
  window.addEventListener(EVENTS.ONLINE, onlineHandler)
  window.addEventListener(EVENTS.APOLLO_ERROR, serverOfflineHandler)

  onDestroy(() => {
    window.removeEventListener(EVENTS.OFFLINE, offlineHander)
    window.removeEventListener(EVENTS.ONLINE, onlineHandler)
    window.removeEventListener(EVENTS.APOLLO_ERROR, serverOfflineHandler)
  })
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
