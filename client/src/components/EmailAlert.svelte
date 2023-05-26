<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { sendValidationMail } from '../codegen'
  import {
    BUTTON_TYPES,
    KIND,
    PATHS,
    PROCESS_ENV,
    PRODUCTION,
    TARGETS,
  } from '../lib/const'
  import NavLink from './NavLink.svelte'
  import Logout from './Logout.svelte'
  import loader from '../stores/loader'
  import alerts from '../stores/alerts'

  export let smallVersion = false

  let success = false
  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION

  async function sendValidationMailHandler() {
    loader.setLoader(sendValidationMail.name, true)
    try {
      const { data } = await sendValidationMail({})
      if (data && data.sendValidationMail) {
        success = true
        alerts.addAlert(KIND.POSITIVE, 'E-Mail wurde erfolgreich versendet')
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
    loader.setLoader(sendValidationMail.name, false)
  }
</script>

{#if $currentUser && !$currentUser.emailValidatedAt && $currentUser.email}
  <p class="intro">Wir empfehlen dir dringend deine E-Mail-Adresse zu validieren</p>
  {#if !smallVersion || success}
    <ul>
      <li>
        <p>
          Bitte prüfe dein E-Mail Postfach und folge den Anweisungen darin. Im
          Ausnahme Fall kann es auch im Spam Ordner landen.
        </p>
      </li>
      <li>
        <p>
          Vielleicht ist auch deine E-Mailadresse falsch hinterlegt, prüfe dies
          <a href={`/${PATHS.SETTINGS}/${PATHS.PROFILE}`} target={TARGETS.SELF}
            >in deinem Profil</a
          >
        </p>
      </li>
    </ul>
  {/if}
  <button
    class="default-button"
    type={BUTTON_TYPES.BUTTON}
    on:click={sendValidationMailHandler}
    >Validierungs E-Mail nochmals senden</button
  >
  {#if !smallVersion}
    <Logout />
  {/if}
{:else}
  <slot />
{/if}

<style>
  .intro {
    margin-top: 15px;
    margin-bottom: 0;
  }

  ul {
    padding-left: 12px;
    margin-bottom: 15px;
  }
  li {
    padding: 0;
  }

  li p {
    margin: 0;
  }

  h3,
  ul {
    opacity: 0.5;
    font-size: 0.75rem;
    font-style: italic;
  }

  a,
  a:visited,
  a:active,
  a:hover {
    color: var(--white);
  }
</style>
