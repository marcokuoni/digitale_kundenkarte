<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { KIND, PATHS, PROCESS_ENV, PRODUCTION } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import Logout from '../components/Logout.svelte'
  import { validateEmail } from '../codegen'
  import { navigate } from 'svelte-routing'
  import { onDestroy, onMount } from 'svelte'
  import EmailAlert from '../components/EmailAlert.svelte'
  import loader from '../stores/loader'
  import alerts from '../stores/alerts'

  export let token = ''
  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION

  let userLoggedIn = false

  onMount(async () => {
    loader.setLoader(validateEmail.name, true)
    if (token) {
      try {
        const { data } = await validateEmail({
          variables: {
            token,
          },
        })
        if (data && data.validateEmail) {
          alerts.addAlert(
            KIND.POSITIVE,
            'E-Mailadresse wurde erfolgreich validiert'
          )
          
          loader.setLoader(currentUser.fetchCurrentUser.name, true)
          currentUser.fetchCurrentUser()
          loader.setLoader(currentUser.fetchCurrentUser.name, false)

          if (!userLoggedIn) {
            navigate(`/${PATHS.LOGIN_USER}`)
          } else {
            navigate(`/${PATHS.CARD}`)
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
    }
    loader.setLoader(validateEmail.name, false)
  })

  const unsubscribe = currentUser.subscribe((currentUser) => {
    if (currentUser) {
      userLoggedIn = true
    }
  })

  onDestroy(unsubscribe)
</script>

<main class="default-section">
  <div class="default-wrapper">
    <h1>E-Mailadresse validieren</h1>

    {#if token === ''}
      <p>Token fehlt. Versuche es noch einmal</p>
      <EmailAlert />
    {/if}

    {#if $currentUser}
      <Logout />
    {:else}
      <NavLink to={`/${PATHS.LOGIN_USER}`}
        >Ich besitze bereits eine Karte (Anmelden)</NavLink
      >
    {/if}
    <NavLink to={`/${PATHS.CREATE_USER}`}
      >Ich möchte eine Karte erstellen</NavLink
    >
    <NavLink to={`/${PATHS.CARD}`}>Zu meiner Karte</NavLink>
  </div>
</main>
