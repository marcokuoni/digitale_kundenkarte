<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { PATHS } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import Logout from '../components/Logout.svelte'
  import { validateEmail } from '../codegen'
  import { navigate } from 'svelte-routing'
  import { onMount } from 'svelte'

  export let token = ''

  onMount(async () => {
    if (token) {
      try {
        const { data } = await validateEmail({
          variables: {
            token,
          },
        })
        if (data && data.validateEmail) {
          navigate(`/${PATHS.CARD}`)
        } else {
          alert('Error')
        }
      } catch (e) {
        console.error(e)
      }
    }
  })
</script>

<h1>E-Mailadresse validieren</h1>

{#if $currentUser}
  <Logout />
{/if}

<NavLink to={`/${PATHS.FORGOT_PASSWORD}`}>Passwort vergessen</NavLink>
<NavLink to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}>Anmelden</NavLink>
<NavLink to={`/${PATHS.CREATE_USER}/${PATHS.WITH_PASSWORD}`}
  >Benutzer erstellen</NavLink
>
<NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>
