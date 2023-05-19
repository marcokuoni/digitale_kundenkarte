<script lang="ts">
  import client from '../services/apollo/client'
  import { purge } from '../services/apollo/persistor'
  import { signOut } from '../codegen'
  import { navigate } from 'svelte-routing'
  import {
    BUTTON_TYPES,
    KIND,
    PATHS,
    PROCESS_ENV,
    PRODUCTION,
  } from '../lib/const'
  import currentUser from '../stores/currentUser'
  import { onDestroy } from 'svelte'
  import loader from '../stores/loader'
  import alerts from '../stores/alerts'

  let hasMoreRights = false
  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION

  async function logout() {
    loader.setLoader(signOut.name, true)
    try {
      const { data } = await signOut({})
      if (data && data.signOut) {
        localStorage.removeItem(PROCESS_ENV.JWT_COOKIE_NAME)
        await purge()
        client.resetStore()
        currentUser.reset()
        alerts.addAlert(KIND.POSITIVE, 'Du wurdest erfolgreich abgemeldet')

        if (hasMoreRights) {
          navigate(`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`)
        } else {
          navigate(`/${PATHS.LOGIN_USER}`)
        }
      } else {
        alerts.addAlert(
          KIND.WARNING,
          'Etwas ist schief gelaufen. Bitte versuche es erneut'
        )
      }
    } catch (e) {
      alerts.addAlert(
        KIND.WARNING,
        'Etwas ist schief gelaufen. Bitte versuche es erneut'
      )
      !production && console.error(e)
    }
    loader.setLoader(signOut.name, false)
    loader.resetLoader()
  }

  const unsubscribe = currentUser.subscribe((currentUser) => {
    if (
      currentUser &&
      currentUser.userRoles &&
      currentUser.userRoles.length > 0
    ) {
      hasMoreRights = true
    }
  })

  onDestroy(unsubscribe)
</script>

<button type={BUTTON_TYPES.BUTTON} on:click={logout}>Abmelden</button>

<style>
  button {
    text-transform: uppercase;
    cursor: pointer;
    padding: 2px 4px;

    font-size: 8pt;
    font-weight: bold;
    color: var(--secondary-color);
    background-color: transparent;

    border: none;
    text-decoration: none;
  }
</style>
