<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { sendValidationMail } from '../codegen'
  import { BUTTON_TYPES, KIND, PATHS, PROCESS_ENV, PRODUCTION } from '../lib/const'
  import NavLink from './NavLink.svelte'
  import Logout from './Logout.svelte'
  import loader from '../stores/loader'
  import alerts from '../stores/alerts'

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
        alerts.addAlert(KIND.WARNING, 'Etwas ist schief gelaufen. Bitte versuche es erneut')
      }
    } catch (e) {
        alerts.addAlert(KIND.WARNING, 'Etwas ist schief gelaufen. Bitte versuche es erneut')
      !production && console.error(e)
    }
    loader.setLoader(sendValidationMail.name, false)
  }
</script>

{#if $currentUser && !$currentUser.emailValidatedAt && $currentUser.email}
  {#if success}
    <p>
      Bitte prüfe dein E-Mail Postfach und folge den Anweisungen darin. Im
      Ausnahme Fall kann es auch im Spam Ordner landen.
    </p>
    <p>
      Vielleicht ist auch deine E-Mailadresse falsch hinterlegt, prüfe dies hier
    </p>

    <NavLink to={`/${PATHS.SETTINGS}/${PATHS.PROFILE}`}>Profil</NavLink>
  {/if}
    <p>Wir empfehlen dir dringend deine E-Mail-Adresse zu validieren</p>
    <button type={BUTTON_TYPES.BUTTON} on:click={sendValidationMailHandler}
      >Validierungs E-Mail nochmals senden</button
    >
    <Logout />
{:else}
  <slot />
{/if}
