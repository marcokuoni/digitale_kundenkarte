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
          !production &&
            console.error(
              'This should not happen otherwise the browser will cache the input data'
            )
        } else {
          alerts.addAlert(
            KIND.WARNING,
            'Etwas ist schief gelaufen. Bitte versuche es erneut'
          )
        }
      } catch (e) {
        if (e.message.indexOf(RECEIVED_CODE_503) >= 0) {
          alerts.addAlert(
            KIND.NEGATIVE,
            `Der Server ist gerade nicht erreichbar. Vermutlich wurdest du für ${formatRelativeTimeS(
              blockinDurationInMs
            )} gesperrt`
          )
        } else {
          alerts.addAlert(
            KIND.NEGATIVE,
            'Transfercode oder Passwort ist falsch'
          )
        }
        !production && console.error(e)
      }
    }
    loader.setLoader(signIn.name, false)
  }
</script>

<main class="default-section">
  <div class="default-wrapper">
    <h1>Zur Karte</h1>

    {#if localStorage.getItem(PROCESS_ENV.JWT_COOKIE_NAME)}
      <Logout />
      {#if withPassword !== ''}
        <NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>
      {:else}
        <NavLink to={`/${PATHS.CARD}`}>Zu meiner Karte</NavLink>
      {/if}
    {:else}
      <form on:submit|preventDefault={loginUser}>
        <div class="form-input-wrapper">
          <label for={NAMES.TRANSFERCODE}>Transfer Code:</label>
          <input
            type={INPUT_TYPES.TEXT}
            id={NAMES.TRANSFERCODE}
            name={NAMES.TRANSFERCODE}
            required
            value=""
          />
        </div>

        {#if withPassword !== ''}
          <div class="form-input-wrapper">
            <label for={NAMES.PASSWORD}>Passwort</label>
            <input
              type={INPUT_TYPES.PASSWORD}
              id={NAMES.PASSWORD}
              name={NAMES.PASSWORD}
              required
              value=""
            />
          </div>
          <NavLink classes={['second-level']} to={`/${PATHS.LOGIN_USER}`}
            >Ohne Passwort</NavLink
          >
        {:else}
          <NavLink
            classes={['second-level']}
            to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}
            >Mit Passwort</NavLink
          >
        {/if}

        <button type={BUTTON_TYPES.SUBMIT} class="default-button">
          Zur Karte
        </button>
      </form>

      <Separator>oder</Separator>

      {#if withPassword !== ''}
        <NavLink to={`/${PATHS.FORGOT_TRANSFERCODE}/${PATHS.WITH_PASSWORD}`}
          >Transfercode vergessen</NavLink
        >
        <NavLink to={`/${PATHS.FORGOT_PASSWORD}`}>Passwort vergessen</NavLink>
        <NavLink to={`/${PATHS.CREATE_USER}/${PATHS.WITH_PASSWORD}`}>
          Benutzer erstellen</NavLink
        >
      {:else}
        <NavLink to={`/${PATHS.FORGOT_TRANSFERCODE}`}
          >Transfercode vergessen</NavLink
        >
        <NavLink to={`/${PATHS.CREATE_USER}`}>Neue Karte erstellen</NavLink>
      {/if}
    {/if}
  </div>
</main>

<style>
  form {
    display: flex;
    flex-direction: column;
  }

  .form-input-wrapper {
    display: flex;
    flex-direction: column;
    margin: 8px 0;
  }

  label {
    font-size: 1rem;
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
