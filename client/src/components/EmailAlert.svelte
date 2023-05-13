<script lang="ts">
  import currentUser from '../stores/currentUser'
  import { sendValidationMail } from '../codegen'

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
  {:else}
    <p>Wir empfehlen dir dringend deine E-Mail-Adresse zu validieren</p>
    <button type="button" on:click={sendValidationMailHandler}
      >Validierungs E-Mail nochmals senden</button
    >
  {/if}
{/if}
