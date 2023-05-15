<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { BUTTON_TYPES, INPUT_TYPES, NAMES, PATHS } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import Logout from '../components/Logout.svelte'
  import { resendTransfercode } from '../codegen'
  import { Wave } from 'svelte-loading-spinners'
  import NoteForValidatedMailAddress from '../components/NoteForValidatedMailAddress.svelte'

  let success = false
  let loading = false

  async function resendTransfercodeHandler(event: SubmitEvent) {
    loading = true
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)
      const email = formData.get(NAMES.EMAIL)?.toString()
      try {
        const { data } = await resendTransfercode({
          variables: {
            email,
          },
        })
        if (data && data.resendTransfercode) {
          success = true
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

<h1>Transfercode vergessen</h1>

{#if $currentUser}
  <Logout />
{:else if success}
  <p>
    Bitte prüfe dein E-Mail Postfach und folge den Anweisungen darin. Im
    Ausnahme Fall kann es auch im Spam Ordner landen.
  </p>
{:else}
  {#if loading}
    <Wave size="100" color="#FF3E00" unit="px" />
  {/if}
  <NoteForValidatedMailAddress />
  <form on:submit|preventDefault={resendTransfercodeHandler}>
    <label for={NAMES.EMAIL}>E-Mail</label>
    <input
      type={INPUT_TYPES.EMAIL}
      id={NAMES.EMAIL}
      name={NAMES.EMAIL}
      required
      value=""
    />
    <button type={BUTTON_TYPES.SUBMIT}>Anfragen</button>
  </form>
{/if}

<NavLink to={`/${PATHS.FORGOT_PASSWORD}`}>Passwort vergessen</NavLink>
<NavLink to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}>Anmelden</NavLink>
<NavLink to={`/${PATHS.CREATE_USER}/${PATHS.WITH_PASSWORD}`}
  >Benutzer erstellen</NavLink
>
<NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>
