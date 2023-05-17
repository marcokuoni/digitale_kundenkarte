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

  const offlineHandler = () => {
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

  window.addEventListener(EVENTS.OFFLINE, offlineHandler)
  window.addEventListener(EVENTS.ONLINE, onlineHandler)
  window.addEventListener(EVENTS.APOLLO_ERROR, serverOfflineHandler)

  onDestroy(() => {
    window.removeEventListener(EVENTS.OFFLINE, offlineHandler)
    window.removeEventListener(EVENTS.ONLINE, onlineHandler)
    window.removeEventListener(EVENTS.APOLLO_ERROR, serverOfflineHandler)
  })
</script>

<button class="status-button" on:click={() => getModal().open()}>

  {#if clientOffline && serverOffline}
    <svg class="online-indicator-icon" width="25" height="17" viewBox="0 0 25 17" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M19.2969 16.9727C22.2461 16.9727 24.5508 14.8145 24.5508 12.1289C24.5508 10.0781 23.3691 8.30078 21.4648 7.5C21.4844 3.14453 18.3496 0 14.3555 0C11.709 0 9.82422 1.41602 8.65234 3.125C6.25 2.42188 3.63281 4.24805 3.58398 6.98242C1.37695 7.33398 0 9.30664 0 11.6895C0 14.5605 2.50977 16.9727 5.84961 16.9727H19.2969ZM12.2852 10.3223C11.7773 10.3223 11.5137 10.0293 11.4941 9.51172L11.3574 5.82031C11.3379 5.26367 11.7285 4.88281 12.2754 4.88281C12.8125 4.88281 13.2227 5.27344 13.2031 5.83008L13.0664 9.51172C13.0469 10.0391 12.7734 10.3223 12.2852 10.3223ZM12.2754 13.5449C11.6895 13.5449 11.1816 13.0664 11.1816 12.4902C11.1816 11.9141 11.6797 11.4355 12.2754 11.4355C12.8711 11.4355 13.3691 11.9043 13.3691 12.4902C13.3691 13.0762 12.8613 13.5449 12.2754 13.5449Z" fill="white"/>
    </svg>
  {:else}
    <svg class="online-indicator-icon" width="25" height="17" viewBox="0 0 25 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.2969 16.9727C22.2461 16.9727 24.5508 14.8145 24.5508 12.1289C24.5508 10.0781 23.3691 8.30078 21.4648 7.5C21.4844 3.14453 18.3496 0 14.3555 0C11.709 0 9.82422 1.41602 8.65234 3.125C6.25 2.42188 3.63281 4.24805 3.58398 6.98242C1.37695 7.33398 0 9.30664 0 11.6895C0 14.5605 2.50977 16.9727 5.84961 16.9727H19.2969ZM11.582 13.1348C11.2598 13.1348 10.9961 12.998 10.7617 12.6953L8.57422 9.94141C8.42773 9.74609 8.34961 9.55078 8.34961 9.3457C8.34961 8.88672 8.70117 8.53516 9.14062 8.53516C9.43359 8.53516 9.67773 8.67188 9.86328 8.92578L11.543 11.123L14.8828 5.54688C15.0391 5.27344 15.3027 5.10742 15.5762 5.10742C16.0352 5.10742 16.4062 5.42969 16.4062 5.85938C16.4062 6.08398 16.2793 6.30859 16.1816 6.46484L12.3633 12.6855C12.1777 12.9785 11.9043 13.1348 11.582 13.1348Z" fill="white"/>
    </svg>
  {/if}

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

  .status-button {
    background: none;
    border: none;
    padding: 0;
    margin-top: 8px;
    margin-right: 6px;
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

  .online-indicator-icon {
    opacity: 0.5;
  }

</style>
