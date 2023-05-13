<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { PATHS } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import Logout from '../components/Logout.svelte'
  import { resetPassword } from '../codegen'
  import { navigate } from 'svelte-routing'
  import jwt_decode from 'jwt-decode'

  export let token = ''

  let password = ''

  async function savePassword() {
    try {
      const { data } = await resetPassword({
        variables: {
          token,
          password,
        },
      })
      if (data && data.resetPassword) {
        navigate(`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`)
      } else {
        alert('Error')
      }
    } catch (e) {
      console.error(e)
    }
  }
</script>

<h1>Passwort zürücksetzen</h1>

{#if $currentUser}
  <Logout />
{:else}
  <form on:submit|preventDefault={savePassword}>
    <label for="password">Passwort</label>
    <input type="password" id="password" required bind:value={password} />
    <button type="submit">Speichern</button>
  </form>
{/if}

<NavLink to={`/${PATHS.FORGOT_PASSWORD}`}>Passwort vergessen</NavLink>
<NavLink to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}>Anmelden</NavLink>
<NavLink to={`/${PATHS.CREATE_USER}/${PATHS.WITH_PASSWORD}`}
  >Benutzer erstellen</NavLink
>
<NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>
