<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { PATHS } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import Logout from '../components/Logout.svelte'
  import { passwordReset } from '../codegen'

  let email = ''
  let success = false

  async function resetPassword() {
    try {
      const { data } = await passwordReset({
        variables: {
          email,
        },
      })
      if (data && data.passwordReset) {
        success = true
      } else {
        alert('Error')
      }
    } catch (e) {
      console.error(e)
    }
  }
</script>

<h1>Passwort vergessen</h1>

{#if $currentUser}
  <Logout />
{:else if success}
  <p>
    Bitte prüfe dein E-Mail Postfach und folge den Anweisungen darin. Im Ausnahme Fall kann es auch im Spam Ordner landen.
  </p>
{:else}
  <form on:submit|preventDefault={resetPassword}>
    <label for="email">E-Mail</label>
    <input type="email" id="email" name="email" required bind:value={email} />
    <button type="submit">Anmelden</button>
  </form>
{/if}

<NavLink to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}>Anmelden</NavLink>
<NavLink to={`/${PATHS.CREATE_USER}/${PATHS.WITH_PASSWORD}`}
  >Benutzer erstellen</NavLink
>
<NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>
