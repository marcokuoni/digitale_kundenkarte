<script lang="ts">
  import { Router, Route } from 'svelte-routing'

  import Online from './components/Online.svelte'

  import PageCard from './routes/PageCard.svelte'
  import PageCreateUser from './routes/PageCreateUser.svelte'
  import PageAddStamp from './routes/PageAddStamp.svelte'
  import PageHome from './routes/PageHome.svelte'
  import PageLogin from './routes/PageLogin.svelte'
  import PageSettings from './routes/settings/PageSettings.svelte'
  import PageSettingsProfile from './routes/settings/PageSettingsProfile.svelte'
  import PageSettingsConnected from './routes/settings/PageSettingsConnected.svelte'
  import PageIpBlocks from './routes/more_rights/PageIpBlocks.svelte'
  import PageQrCode from './routes/more_rights/PageQrCode.svelte'
  import PageUserRoles from './routes/more_rights/PageUserRoles.svelte'
  import { PARAMS, PATHS, USER_ROLES } from './lib/const'
  import SecuredRoute from './components/SecuredRoute.svelte'
  import PageHonourCard from './routes/more_rights/PageHonourCard.svelte'
  import currentUser from './stores/currentUser'
  import { onMount } from 'svelte'
  import PageForgotPassword from './routes/PageForgotPassword.svelte'
  import PageResetPassword from './routes/PageResetPassword.svelte'
  import PageValidateEmail from './routes/PageValidateEmail.svelte'
  import PageForgotTransfercode from './routes/PageForgotTransfercode.svelte'
  import Loader from './components/Loader.svelte'
  import loader from './stores/loader'
  import ToastContainer from './components/ToastContainer.svelte'

  export let url = ''
  loader.setLoader(currentUser.fetchCurrentUser.name, true)

  onMount(() => {
    currentUser.fetchCurrentUser()
    loader.setLoader(currentUser.fetchCurrentUser.name, false)
  })
</script>

<main>
  {#if $loader}
    <Loader />
  {/if}
  <header>
    <Online />
  </header>
  <section>
    <Router {url}>
      <div>
        <Route path={PATHS.CARD}>
          <PageCard />
        </Route>

        <Route path={PATHS.HOME}>
          <PageHome />
        </Route>

        <Route path={`${PATHS.CREATE_USER}`}>
          <PageCreateUser />
        </Route>

        <Route
          path={`${PATHS.CREATE_USER}/:${PARAMS.WITH_PASSWORD}`}
          let:params
        >
          <PageCreateUser withPassword={params.withPassword} />
        </Route>

        <Route path={`${PATHS.LOGIN_USER}`}>
          <PageLogin />
        </Route>

        <Route path={`${PATHS.FORGOT_TRANSFERCODE}`}>
          <PageForgotTransfercode />
        </Route>

        <Route
          path={`${PATHS.FORGOT_TRANSFERCODE}/:${PARAMS.WITH_PASSWORD}`}
          let:params
        >
          <PageForgotTransfercode withPassword={params.withPassword} />
        </Route>

        <Route path={`${PATHS.FORGOT_PASSWORD}`}>
          <PageForgotPassword />
        </Route>

        <Route path={`${PATHS.RESET_PASSWORD}/:${PARAMS.TOKEN}`} let:params>
          <PageResetPassword token={params.token} />
        </Route>

        <Route path={`${PATHS.VERIFY_EMAIL}/:${PARAMS.TOKEN}`} let:params>
          <PageValidateEmail token={params.token} />
        </Route>

        <Route path={`${PATHS.LOGIN_USER}/:${PARAMS.WITH_PASSWORD}`} let:params>
          <PageLogin withPassword={params.withPassword} />
        </Route>

        <Route path={`${PATHS.ADD_STAMP}/:${PARAMS.URL_TOKEN}`} let:params>
          <PageAddStamp urlToken={params.urlToken} />
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

        <SecuredRoute path={PATHS.IP_BLOCKS} requiredRoles={[USER_ROLES.ADMIN]}>
          <PageIpBlocks />
        </SecuredRoute>

        <SecuredRoute
          path={PATHS.USER_ROLES}
          requiredRoles={[USER_ROLES.ADMIN]}
        >
          <PageUserRoles />
        </SecuredRoute>

        <SecuredRoute
          path={PATHS.QR_CODE}
          requiredRoles={[USER_ROLES.EMPLOYEE]}
        >
          <PageQrCode />
        </SecuredRoute>

        <SecuredRoute
          path={PATHS.HONOUR_CARD}
          requiredRoles={[USER_ROLES.EMPLOYEE]}
        >
          <PageHonourCard />
        </SecuredRoute>

        <SecuredRoute
          path={`${PATHS.HONOUR_CARD}/:${PARAMS.TRANSFERCODE}`}
          let:params
          requiredRoles={[USER_ROLES.EMPLOYEE]}
        >
          <PageHonourCard transfercode={params.transfercode} />
        </SecuredRoute>
      </div>
    </Router>
  </section>
  <footer />
  <ToastContainer />
</main>

<style>
  main,
  main > section,
  main > section > div {
    min-height: calc(100vh - 40px);
  }

  main > section > div {
    padding: 20px;
  }

  main > header {
    padding: 5px 10px;
    display: flex;
    justify-content: right;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
</style>
