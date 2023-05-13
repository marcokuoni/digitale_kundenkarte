<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { PATHS } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import Logout from '../components/Logout.svelte'
  import { validateEmail } from '../codegen'
  import { navigate } from 'svelte-routing'
  import { onDestroy, onMount } from 'svelte'

  export let token = ''
  let userLoggedIn = false

  onMount(async () => {
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
  })

  const unsubscribe = currentUser.subscribe((currentUser) => {
    if (currentUser) {
      userLoggedIn = true
    }
  })

  onDestroy(unsubscribe)
</script>

<h1>E-Mailadresse validieren</h1>

{#if $currentUser}
  <Logout />
{:else}
  <NavLink to={`/${PATHS.LOGIN_USER}`}
    >Ich besitze bereits eine Karte (Anmelden)</NavLink
  >
{/if}
<NavLink to={`/${PATHS.CREATE_USER}`}>Ich möchte eine Karte erstellen</NavLink>
<NavLink to={`/${PATHS.CARD}`}>Zu meiner Karte</NavLink>
