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
  import PageLogin from './routes/PageLogin.svelte'
  import { PATHS } from './lib/const'

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
        <Route path={PATHS.HOME}>
          <PageHome />
        </Route>

        <Route path={PATHS.CARD}>
          <PageCard />
        </Route>

        <Route path={PATHS.CREATE_USER}>
          <PageCreate />
        </Route>

        <Route path={PATHS.LOGIN_USER}>
          <PageLogin />
        </Route>

        <Route path={PATHS.STAMP}>
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

