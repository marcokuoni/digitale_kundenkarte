<script lang="ts">
  import { Router, Route } from 'svelte-routing';

  import PageQueries from './routes/PageQueries.svelte';
  import PageMutation from './routes/PageMutation.svelte';
  import NavLink from './components/NavLink.svelte';

  // Our routes from /src/routes/
  import PageCard from './routes/PageCard.svelte'
  import PageCreate from './routes/PageCreate.svelte'
  import PageStamp from './routes/PageStamp.svelte'
  import PageHome from './routes/PageHome.svelte'

  export let url = ''
</script>

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

<Router {url}>
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
