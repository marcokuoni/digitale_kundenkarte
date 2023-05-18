<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { BUTTON_TYPES, INPUT_TYPES, NAMES, PATHS } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import Logout from '../components/Logout.svelte'
  import { passwordReset } from '../codegen'
  import NoteForValidatedMailAddress from '../components/NoteForValidatedMailAddress.svelte'
  import Separator from '../components/Separator.svelte'
  import loader from '../stores/loader'

  let success = false

  async function resetPassword(event: SubmitEvent) {
    loader.setLoader(passwordReset.name, true)
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)
      const email = formData.get(NAMES.EMAIL)?.toString()
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
    loader.setLoader(passwordReset.name, false)
  }
</script>


<main class="default-section">
  <div class="default-wrapper">

    <h1>Passwort vergessen</h1>

    {#if $currentUser}
      <Logout />
    {:else if success}
      <p>
        Bitte prüfe dein E-Mail Postfach und folge den Anweisungen darin. Im
        Ausnahme Fall kann es auch im Spam Ordner landen.
      </p>
    {:else}
      <NoteForValidatedMailAddress />

      <form on:submit|preventDefault={resetPassword}>

        <label for={NAMES.EMAIL}>E-Mail</label>
        <input type={INPUT_TYPES.EMAIL}
               id={NAMES.EMAIL}
               name={NAMES.EMAIL}
               required
               value=""/>

        <button type={BUTTON_TYPES.SUBMIT} class="default-button">Zurücksetzen</button>

      </form>
    {/if}

    <Separator>oder</Separator>

    <NavLink to={`/${PATHS.FORGOT_TRANSFERCODE}`}>Transfercode vergessen</NavLink>
    <!--<NavLink to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}>Anmelden</NavLink>-->
    <!--<NavLink to={`/${PATHS.CREATE_USER}/${PATHS.WITH_PASSWORD}`}>Benutzer erstellen</NavLink>-->
    <NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>

  </div>
</main>


<style>

  form {
    display: flex;
    flex-direction: column;
    margin-top: 12px;
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

