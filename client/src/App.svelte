<script lang="ts">
  import { Router, Route } from 'svelte-routing'

  import PageQueries from './routes/PageQueries.svelte'
  import PageMutation from './routes/PageMutation.svelte'
  import NavLink from './components/NavLink.svelte'

  // Our routes from /src/routes/
  import PageCard from './routes/PageCard.svelte'
  import PageCreate from './routes/PageCreate.svelte'
  import PageStamp from './routes/PageStamp.svelte'
  import PageHome from './routes/PageHome.svelte'
  import { onMount } from 'svelte'

  export let url = ''
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
    const objectStore = db
      .transaction(['requests'], 'readonly')
      .objectStore('requests')
    const myIndex = objectStore.index('queueName')
    const countRequest = myIndex.count()
    countRequest.onsuccess = () => {
      queuedRequestSize = countRequest.result || 0
      serverOffline = queuedRequestSize > 0
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

<Router {url}>
  <!-- TODO: Make this nice looking -->
  {#if clientOffline}
    <span>CLIENT OFFLINE :(</span>
  {/if}
  {#if serverOffline}
    <span>SERVER OFFLINE :(</span>
  {/if}

  {#if queuedRequestSize > 0}
    <span>Queued Requests: {queuedRequestSize}</span>
  {/if}
  <nav>
    <NavLink to="query">Query</NavLink>
    <NavLink to="mutation">Mutation</NavLink>
  </nav>
  <div>
    <Route path="query">
      <PageQueries />
    </Route>
    <Route path="mutation">
      <PageMutation />
    </Route>
  </div>
  <div>
    <Route path="">
      <PageHome />
    </Route>

    <Route path="card">
      <PageCard />
    </Route>

    <Route path="create">
      <PageCreate />
    </Route>

    <Route path="stamp">
      <PageStamp />
    </Route>
  </div>
</Router>

<style>
  .title {
    background-color: #444444;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: xx-large;
  }

  /* ... */

  nav {
    background-color: #ff3e00;
    height: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: white;
  }
</style>
