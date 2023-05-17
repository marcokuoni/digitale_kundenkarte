<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { PATHS } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import Logout from '../components/Logout.svelte'
  import { validateEmail } from '../codegen'
  import { navigate } from 'svelte-routing'
  import { onDestroy, onMount } from 'svelte'
  import { Wave } from 'svelte-loading-spinners'
  import EmailAlert from '../components/EmailAlert.svelte'

  export let token = ''

  let userLoggedIn = false
  let loading = false

  onMount(async () => {
    loading = true
    if (token) {
      try {
        const { data } = await validateEmail({
          variables: {
            token,
          },
        })
        if (data && data.validateEmail) {
          if (!userLoggedIn) {
            navigate(`/${PATHS.LOGIN_USER}`)
          } else {
            navigate(`/${PATHS.CARD}`)
          }
        } else {
          alert('Error')
        }
      } catch (e) {
        console.error(e)
      }
    }
    loading = false
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

    {#if loading} <Wave size="100" color="#FF3E00" unit="px" /> {/if}

    {#if token === ''}
      <p>Token fehlt. Versuche es noch einmal</p>
      <EmailAlert />
    {/if}

    {#if $currentUser}
      <Logout />
    {:else}
      <NavLink to={`/${PATHS.LOGIN_USER}`}>Ich besitze bereits eine Karte (Anmelden)</NavLink>
    {/if}
    <NavLink to={`/${PATHS.CREATE_USER}`}>Ich möchte eine Karte erstellen</NavLink>
    <NavLink to={`/${PATHS.CARD}`}>Zu meiner Karte</NavLink>

  </div>
</main>

