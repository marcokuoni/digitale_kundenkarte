<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { sendValidationMail } from '../codegen'
  import { BUTTON_TYPES, PATHS } from '../lib/const'
  import NavLink from './NavLink.svelte'
  import Logout from './Logout.svelte'

  let success = false

  async function sendValidationMailHandler() {
    try {
      const { data } = await sendValidationMail({})
      if (data && data.sendValidationMail) {
        success = true
      } else {
        alert('Error')
      }
    } catch (e) {
      console.error(e)
    }
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
