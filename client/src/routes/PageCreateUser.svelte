<script lang="ts">
  import { signUp } from '../codegen'
  import {
    BUTTON_TYPES,
    INPUT_TYPES,
    KIND,
    NAMES,
    PATHS,
    PROCESS_ENV,
    PRODUCTION,
    TRUE,
  } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import currentUser from '../stores/currentUser'
  import Logout from '../components/Logout.svelte'
  import Separator from '../components/Separator.svelte'
  import loader from '../stores/loader'
  import alerts from '../stores/alerts'

  export let withPassword: string = ''
  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION

  async function createUser(event: SubmitEvent) {
    loader.setLoader(signUp.name, true)
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)

      const name = formData.get(NAMES.NAME)?.toString()
      const email = formData.get(NAMES.EMAIL)?.toString()
      const newsletter = formData.get(NAMES.NEWSLETTER)?.toString() === TRUE
      const password = formData.get(NAMES.PASSWORD)?.toString()
      try {
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
        alerts.addAlert(
          KIND.WARNING,
          'Etwas ist schief gelaufen. Bitte versuche es erneut'
        )
        !production && console.error(e)
      }
    }
    loader.setLoader(signUp.name, false)
  }
</script>

<main class="default-section">
  <div class="default-wrapper">
    <h1>
      {#if withPassword !== ''}
        Benutzer erstellen
      {:else}
        Karte erstellen
      {/if}
    </h1>
    <form on:submit|preventDefault={createUser}>
      <div class="input-wrapper">
        <label for={NAMES.NAME}>Name</label>
        <input
          type={INPUT_TYPES.TEXT}
          id={NAMES.NAME}
          name={NAMES.NAME}
          value=""
        />
      </div>

      <div class="input-wrapper">
        <label for={NAMES.EMAIL}>E-Mail</label>
        <input
          type={INPUT_TYPES.EMAIL}
          required={withPassword !== ''}
          id={NAMES.EMAIL}
          name={NAMES.EMAIL}
          value=""
        />
      </div>

      <div class="input-wrapper checkbox-wrapper">
        <input
          type={INPUT_TYPES.CHECKBOX}
          id={NAMES.NEWSLETTER}
          name={NAMES.NEWSLETTER}
          value={TRUE}
          checked={false}
        />
        <label for={NAMES.NEWSLETTER}>Newsletter</label>
      </div>

      {#if withPassword !== ''}
        <div class="input-wrapper">
          <label for={NAMES.PASSWORD}>Passwort</label>
          <input
            type={INPUT_TYPES.PASSWORD}
            id={NAMES.PASSWORD}
            name={NAMES.PASSWORD}
            required
            value=""
          />
        </div>
      {/if}

      <button type={BUTTON_TYPES.SUBMIT} class="default-button">
        {#if withPassword !== ''}
          Benutzer erstellen
        {:else}
          Karte erstellen
        {/if}
      </button>
    </form>

    <Separator>oder</Separator>

    {#if withPassword !== ''}
      {#if $currentUser}
        <Logout />
        <NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>
      {:else}
        <NavLink to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}
          >Anmelden</NavLink
        >
        <NavLink to={`/${PATHS.FORGOT_PASSWORD}`}>Passwort vergessen</NavLink>
      {/if}
    {:else if $currentUser}
      <Logout />
      <NavLink to={`/${PATHS.CARD}`}>Zu meiner Karte</NavLink>
    {:else}
      <NavLink to={`/${PATHS.LOGIN_USER}`}
        >Ich besitze bereits eine Karte</NavLink
      >
    {/if}

    {#if withPassword !== ''}
      <NavLink to={`/${PATHS.FORGOT_TRANSFERCODE}/${PATHS.WITH_PASSWORD}`}
        >Transfercode vergessen</NavLink
      >
    {:else}
      <NavLink to={`/${PATHS.FORGOT_TRANSFERCODE}`}
        >Transfercode vergessen</NavLink
      >
    {/if}
  </div>
</main>

<style>
  form {
    display: flex;
    flex-direction: column;
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
