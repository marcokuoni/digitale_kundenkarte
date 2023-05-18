<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { BUTTON_TYPES, INPUT_TYPES, NAMES, PATHS } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import Logout from '../components/Logout.svelte'
  import { resetPassword } from '../codegen'
  import { navigate } from 'svelte-routing'
  import Separator from '../components/Separator.svelte'
  import loader from '../stores/loader'

  export let token = ''

  async function savePassword(event: SubmitEvent) {
    loader.setLoader(resetPassword.name, true)
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
    loader.setLoader(resetPassword.name, false)
  }
</script>


<main class="default-section">
  <div class="default-wrapper">

    <h1>Passwort zurücksetzen</h1>

    {#if $currentUser}
      <Logout />
    {:else}
      {#if token === ''}
        <p>Token fehlt. Versuche es noch einmal</p>
      {:else}
        <form on:submit|preventDefault={savePassword}>

          <label for={NAMES.PASSWORD}>Passwort</label>
          <input type={INPUT_TYPES.PASSWORD}
                 id={NAMES.PASSWORD}
                 required
                 value=""/>

          <button type={BUTTON_TYPES.SUBMIT} class="default-button">Speichern</button>

        </form>
      {/if}
    {/if}

    <Separator>oder</Separator>

    <NavLink to={`/${PATHS.FORGOT_PASSWORD}`}>Passwort vergessen</NavLink>
    <NavLink to={`/${PATHS.FORGOT_TRANSFERCODE}`}>Transfercode vergessen</NavLink>
    <NavLink to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}>Anmelden</NavLink>
    <NavLink to={`/${PATHS.CREATE_USER}/${PATHS.WITH_PASSWORD}`}>Benutzer erstellen</NavLink>
    <NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>

  </div>
</main>


<style>

  form {
    display: flex;
    flex-direction: column;
  }

  label {
    font-size: 11pt;
    font-weight: bold;
  }

  input {
    color: var(--foreground-color);
    background-color: var(--background-raised-color);

    padding: 8px 12px;

    border: none;
    border-radius: 8px;
  }

</style>
