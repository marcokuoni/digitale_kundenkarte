<script lang="ts">
  import { signIn } from '../codegen'
  import {
    BUTTON_TYPES,
    INPUT_TYPES,
    KIND,
    NAMES,
    PATHS,
    PROCESS_ENV,
    PRODUCTION,
    RECEIVED_CODE_503,
  } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import currentUser from '../stores/currentUser'
  import Logout from '../components/Logout.svelte'
  import { formatRelativeTimeS } from '../lib/formater'
  import Separator from '../components/Separator.svelte'
  import loader from '../stores/loader'
  import alerts from '../stores/alerts'

  export let withPassword: string = ''

  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION
  const blockinDurationInMs =
    parseInt(PROCESS_ENV.BLOCKING_DURATION_MS) > 0
      ? Math.ceil(parseInt(PROCESS_ENV.BLOCKING_DURATION_MS) / 1000)
      : 0

  async function loginUser(event: SubmitEvent) {
    loader.setLoader(signIn.name, true)
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)
      const transfercode = formData.get(NAMES.TRANSFERCODE)?.toString()
      const password = formData.get(NAMES.PASSWORD)?.toString()
      try {
        const { data } = await signIn({
          variables: {
            transfercode,
            password,
            successRedirect: `/${PATHS.CARD}`,
          },
        })
        if (data && data.signIn) {
          !production && console.error(
            'This should not happen otherwise the browser will cache the input data'
          )
        } else {
          alerts.addAlert(KIND.WARNING, 'Etwas ist schief gelaufen. Bitte versuche es erneut')
        }
      } catch (e) {
        if (e.message.indexOf(RECEIVED_CODE_503) >= 0) {
          alerts.addAlert(KIND.NEGATIVE, `Der Server ist gerade nicht erreichbar. Vermutlich wurdest du für ${formatRelativeTimeS(
              blockinDurationInMs
            )} gesperrt`)
        } else {
          alerts.addAlert(KIND.NEGATIVE, 'Transfercode oder Passwort ist falsch')
        }
        !production && console.error(e)
      }
    }
    loader.setLoader(signIn.name, false)
  }
</script>


<main class="default-section">
  <div class="default-wrapper">

    <h1>Anmelden</h1>

    {#if $currentUser}
      <Logout />
    {:else}
      <form on:submit|preventDefault={loginUser}>

        <label for={NAMES.TRANSFERCODE}>Transfer Code:</label>
        <input type={INPUT_TYPES.TEXT}
               id={NAMES.TRANSFERCODE}
               name={NAMES.TRANSFERCODE}
               required
               value=""/>

        {#if withPassword !== ''}
          <label for={NAMES.PASSWORD}>Passwort</label>
          <input type={INPUT_TYPES.PASSWORD}
                 id={NAMES.PASSWORD}
                 name={NAMES.PASSWORD}
                 required
                 value=""/>
        {/if}

        <button type={BUTTON_TYPES.SUBMIT} class="default-button">Anmelden</button>

      </form>

      <Separator>oder</Separator>

      {#if withPassword !== ''}
        <NavLink to={`/${PATHS.FORGOT_PASSWORD}`}>Passwort vergessen</NavLink>
      {:else}
        <NavLink to={`/${PATHS.CREATE_USER}`}>Neue Karte erstellen</NavLink>
      {/if}

      <NavLink to={`/${PATHS.FORGOT_TRANSFERCODE}`}>Transfercode vergessen</NavLink>

    {/if}

    {#if withPassword !== ''}
      <NavLink to={`/${PATHS.CREATE_USER}/${PATHS.WITH_PASSWORD}`}>
        Benutzer erstellen</NavLink>
      <NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>
    {:else}
      <NavLink to={`/${PATHS.CARD}`}>Zu meiner Karte</NavLink>
    {/if}

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