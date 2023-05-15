<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { BUTTON_TYPES, INPUT_TYPES, NAMES, PATHS } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import Logout from '../components/Logout.svelte'
  import { resetPassword } from '../codegen'
  import { navigate } from 'svelte-routing'
  import { Wave } from 'svelte-loading-spinners'

  export let token = ''

  let loading = false

  async function savePassword(event: SubmitEvent) {
    loading = true
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)
      const password = formData.get(NAMES.PASSWORD)?.toString()
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
    loading = false
  }
</script>

<h1>Passwort zürücksetzen</h1>

{#if $currentUser}
  <Logout />
{:else}
  {#if loading}
    <Wave size="100" color="#FF3E00" unit="px" />
  {/if}
  {#if token === ''}
    <p>Token fehlt. Versuche es noch einmal</p>
  {:else}
    <form on:submit|preventDefault={savePassword}>
      <label for={NAMES.PASSWORD}>Passwort</label>
      <input
        type={INPUT_TYPES.PASSWORD}
        id={NAMES.PASSWORD}
        required
        value=""
      />
      <button type={BUTTON_TYPES.SUBMIT}>Speichern</button>
    </form>
  {/if}
{/if}

<NavLink to={`/${PATHS.FORGOT_PASSWORD}`}>Passwort vergessen</NavLink>
<NavLink to={`/${PATHS.FORGOT_TRANSFERCODE}`}>Transfercode vergessen</NavLink>
<NavLink to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}>Anmelden</NavLink>
<NavLink to={`/${PATHS.CREATE_USER}/${PATHS.WITH_PASSWORD}`}
  >Benutzer erstellen</NavLink
>
<NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>
