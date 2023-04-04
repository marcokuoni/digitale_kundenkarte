<script lang="ts">
  import { Router, Route } from 'svelte-routing'

  import PageQueries from './routes/PageQueries.svelte'
  import PageMutation from './routes/PageMutation.svelte'
  import Online from './components/Online.svelte'

  // Our routes from /src/routes/
  import PageCard from './routes/PageCard.svelte'
  import PageCreate from './routes/PageCreate.svelte'
  import PageStamp from './routes/PageStamp.svelte'
  import PageHome from './routes/PageHome.svelte'

  export let url = ''
</script>

<main>
  <header>
    <Online />
  </header>
  <section>
    <Router {url}>
      <!-- TODO: remove demo routes-->
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

        <Route path="create-user">
          <PageCreate />
        </Route>

        <Route path="stamp">
          <PageStamp />
        </Route>
      </div>
    </Router>
  </section>
  <footer />
</main>

<style>
  main header {
    padding: 5px 10px;
    display: flex;
    justify-content: right;
  }
</style>

