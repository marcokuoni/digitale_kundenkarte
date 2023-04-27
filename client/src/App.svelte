<script lang="ts">
  import { Router, Route } from 'svelte-routing'

  import PageQueries from './routes/PageQueries.svelte'
  import PageMutation from './routes/PageMutation.svelte'
  import Online from './components/Online.svelte'
  import { onMount } from 'svelte'

  // Our routes from /src/routes/
  import PageCard from './routes/PageCard.svelte'
  import PageCreate from './routes/PageCreate.svelte'
  import PageStamp from './routes/PageStamp.svelte'
  import PageHome from './routes/PageHome.svelte'
  import PageLogin from './routes/PageLogin.svelte'
  import PageSettings from './routes/PageSettings.svelte'
  import PageSettingsProfile from './routes/PageSettingsProfile.svelte'
  import PageSettingsConnected from './routes/PageSettingsConnected.svelte'
  import PageSettingsIpBlocks from './routes/PageSettingsIpBlocks.svelte'
  import { PATHS, UserRoles } from './lib/const'
  import { checkAccessRights } from './services/auth'
  import {
    currentUser,
    fetchCurrentUser,
    currentUserLoading,
    currentUserError,
  } from './stores/currentUser'

  onMount(() => {
    fetchCurrentUser()
  })
  
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
      <!-- //TODO: remove demo routes-->
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

        <Route path={PATHS.SETTINGS}>
          <PageSettings />
        </Route>

        <Route path={`${PATHS.SETTINGS}/${PATHS.PROFILE}`}>
          <PageSettingsProfile />
        </Route>

        <Route path={`${PATHS.SETTINGS}/${PATHS.CONNECTED}`}>
          <PageSettingsConnected />
        </Route>

        <!--TODO: This leads to breaking refreshes -->
        {#if $currentUserLoading}
          <!-- TODO: we need a way to communicate loading and alert states to the user? -->
          <span>Loading...</span>
        {:else if $currentUserError}
          <span>Error: {$currentUserError}</span>
        {:else if checkAccessRights($currentUser, [UserRoles.ADMIN])}
          <Route path={`${PATHS.SETTINGS}/${PATHS.IP_BLOCKS}`}>
            <PageSettingsIpBlocks />
          </Route>
        {/if}
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
