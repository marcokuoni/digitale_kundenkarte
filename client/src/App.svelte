<script lang="ts">
  import { Router, Route } from 'svelte-routing'

  import PageQueries from './routes/PageQueries.svelte'
  import PageMutation from './routes/PageMutation.svelte'
  import Online from './components/Online.svelte'

  // Our routes from /src/routes/
  import PageCard from './routes/PageCard.svelte'
  import PageCreateUser from './routes/PageCreateUser.svelte'
  import PageAddStamp from './routes/PageAddStamp.svelte'
  import PageHome from './routes/PageHome.svelte'
  import PageLogin from './routes/PageLogin.svelte'
  import PageSettings from './routes/PageSettings.svelte'
  import PageSettingsProfile from './routes/settings/PageSettingsProfile.svelte'
  import PageSettingsConnected from './routes/settings/PageSettingsConnected.svelte'
  import PageSettingsIpBlocks from './routes/settings/PageSettingsIpBlocks.svelte'
  import PageSettingsQrCode from './routes/settings/PageSettingsQrCode.svelte'
  import { PATHS, UserRoles } from './lib/const'
  import SecuredRoute from './components/SecuredRoute.svelte'

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
          <PageCreateUser />
        </Route>

        <Route path={PATHS.LOGIN_USER}>
          <PageLogin />
        </Route>

        <Route path={`${PATHS.ADD_STAMP}/:urlToken`} let:params>
          <PageAddStamp urlToken="{params.urlToken}"/>
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

        <SecuredRoute path={`${PATHS.SETTINGS}/${PATHS.IP_BLOCKS}`} requiredRoles={[UserRoles.ADMIN]}>
          <PageSettingsIpBlocks />
        </SecuredRoute>

        <SecuredRoute path={`${PATHS.SETTINGS}/${PATHS.QR_CODE}`} requiredRoles={[UserRoles.EMPLOYEE]}>
          <PageSettingsQrCode />
        </SecuredRoute>
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
