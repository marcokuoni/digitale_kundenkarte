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

  export let url = ''
  const checkForOneMinute = 60
  let checkCounter = 0
  let offline = false
  let queuedRequestSize = 0
  let db = null
  const DBOpenRequest = window.indexedDB.open('workbox-background-sync')

  window.addEventListener('offline', () => {
    offline = true
  })

  window.addEventListener('online', () => {
    offline = false
    if (queuedRequestSize > 0) {
      checkCounter = 0
      checkRequestCountRecursive()
    }
  })

  window.addEventListener('apolloError', () => {
    checkQueuedRequestCount()
  })

  DBOpenRequest.onsuccess = (event) => {
    db = DBOpenRequest.result
  }

  async function checkRequestCountRecursive() {
    setTimeout(() => {
      checkQueuedRequestCount()
      if (queuedRequestSize > 0 && checkCounter < checkForOneMinute) {
        checkCounter++
        checkRequestCountRecursive()
      }
    }, 1000)
  }

  async function checkQueuedRequestCount() {
    const objectStore = db
      .transaction(['requests'], 'readonly')
      .objectStore('requests')
    const myIndex = objectStore.index('queueName')
    const countRequest = myIndex.count()
    countRequest.onsuccess = () => {
      queuedRequestSize = countRequest.result || 0
    }
  }
</script>

<Router {url}>
  <!-- TODO: Make this nice looking -->
  {#if offline}
    <span>OFFLINE :(</span>
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
