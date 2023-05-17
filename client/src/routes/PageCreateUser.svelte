<script lang="ts">
  import { signUp } from '../codegen'
  import { BUTTON_TYPES, INPUT_TYPES, NAMES, PATHS, TRUE } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import currentUser from '../stores/currentUser'
  import Logout from '../components/Logout.svelte'
  import { Wave } from 'svelte-loading-spinners'
  import Separator from '../components/Separator.svelte'

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

<main class="default-section">
  <div class="default-wrapper">

    <h1>Benutzer erstellen</h1>

    {#if loading} <Wave size="100" color="#FF3E00" unit="px" /> {/if}

    <form on:submit|preventDefault={createUser}>

      <div class="input-wrapper">
        <label for={NAMES.NAME}>Name</label>
        <input type={INPUT_TYPES.TEXT} id={NAMES.NAME} name={NAMES.NAME} value=''/>
      </div>


      <div class="input-wrapper">
        <label for={NAMES.EMAIL}>E-Mail</label>
        <input type={INPUT_TYPES.EMAIL}
               required={withPassword !== ''}
               id={NAMES.EMAIL}
               name={NAMES.EMAIL}
               value=''/>
      </div>

      <div class="input-wrapper checkbox-wrapper">
        <input type={INPUT_TYPES.CHECKBOX}
               id={NAMES.NEWSLETTER}
               name={NAMES.NEWSLETTER}
               value={TRUE}
               checked={false}/>
        <label for={NAMES.NEWSLETTER}>Newsletter</label>
      </div>

      {#if withPassword !== ''}
        <div class="input-wrapper">
          <label for={NAMES.PASSWORD}>Passwort</label>
          <input type={INPUT_TYPES.PASSWORD}
                 id={NAMES.PASSWORD}
                 name={NAMES.PASSWORD}
                 required
                 value=''/>
        </div>
      {/if}

      <button type={BUTTON_TYPES.SUBMIT} class="default-button">Benutzer erstellen</button>

    </form>

    <Separator>oder</Separator>

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

  .input-wrapper {
    display: flex;
    flex-direction: column;
    margin: 8px 0;
  }

  .checkbox-wrapper {
    flex-direction: row;
  }

  .checkbox-wrapper > input {
    margin-right: 8px;
  }

</style>
