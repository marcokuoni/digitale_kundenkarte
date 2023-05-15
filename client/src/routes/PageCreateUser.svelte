<script lang="ts">
  import { signUp } from '../codegen'
  import { BUTTON_TYPES, INPUT_TYPES, NAMES, PATHS, TRUE } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import currentUser from '../stores/currentUser'
  import Logout from '../components/Logout.svelte'
  import { Wave } from 'svelte-loading-spinners'

  export let withPassword: string = ''

  let loading = false

  async function createUser(event: SubmitEvent) {
    loading = true
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)

      const name = formData.get(NAMES.NAME)?.toString()
      const email = formData.get(NAMES.EMAIL)?.toString()
      const newsletter = formData.get(NAMES.NEWSLETTER)?.toString() === TRUE
      const password = formData.get(NAMES.PASSWORD)?.toString()
      const { data } = await signUp({
        variables: {
          name,
          email,
          newsletter,
          password,
          successRedirect: `/${PATHS.CARD}`,
        },
      })
      if (data && data.signUp) {
        console.error(
          'This should not happen otherwise the browser will cache the input data'
        )
      } else {
        alert('Error')
      }
    }
    loading = false
  }
</script>

<h1>Benutzer erstellen</h1>
{#if loading}
  <Wave size="100" color="#FF3E00" unit="px" />
{/if}
<form on:submit|preventDefault={createUser}>
  <label for={NAMES.NAME}>Name</label>
  <input type={INPUT_TYPES.TEXT} id={NAMES.NAME} name={NAMES.NAME} value='' />
  <label for={NAMES.EMAIL}>E-Mail</label>
  <input
    type={INPUT_TYPES.EMAIL}
    required={withPassword !== ''}
    id={NAMES.EMAIL}
    name={NAMES.EMAIL}
    value=''
  />
  <label for={NAMES.NEWSLETTER}
    ><input
      type={INPUT_TYPES.CHECKBOX}
      id={NAMES.NEWSLETTER}
      name={NAMES.NEWSLETTER}
      value={TRUE}
      checked={false}
    /> Will Newsletter</label
  >
  {#if withPassword !== ''}
    <label for={NAMES.PASSWORD}>Passwort</label>
    <input
      type={INPUT_TYPES.PASSWORD}
      id={NAMES.PASSWORD}
      name={NAMES.PASSWORD}
      required
      value=''
    />
  {/if}
  <button type={BUTTON_TYPES.SUBMIT}>Benutzer erstellen</button>
</form>

{#if withPassword !== ''}
  <NavLink to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}>Anmelden</NavLink>
  {#if $currentUser}
    <Logout />
    <NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>
  {:else}
    <NavLink to={`/${PATHS.FORGOT_PASSWORD}`}>Passwort vergessen</NavLink>
  {/if}
{:else}
  {#if $currentUser}
    <Logout />
  {:else}
    <NavLink to={`/${PATHS.LOGIN_USER}`}>Ich besitze bereits eine Karte</NavLink
    >
  {/if}
  <NavLink to={`/${PATHS.CARD}`}>Zu meiner Karte</NavLink>
{/if}

<NavLink to={`/${PATHS.FORGOT_TRANSFERCODE}`}>Transfercode vergessen</NavLink>