<script lang="ts">
  import { onMount } from 'svelte'
  import { generateUrlToken } from '../../codegen'
  import SettingsPage from '../../components/SettingsPage.svelte'
  import { PATHS } from '../../lib/const'

  let currentDate = new Date()

  let createStampUrl = `${window.location.origin}/${PATHS.ADD_STAMP}`
  let createQRCodeUrl =
    'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' +
    createStampUrl
  let validUntil = new Date()
  let blockForMinutes = 0
  let longTimeQr = false
  let token = ''
  let validUntilInput = ''

  let blockForMinutesInput = parseInt('process.env.DEFAULT_URL_TOKEN_BLOCK_FOR_MINUTES') // 12 hours
  let defaultValidForMinutes = parseInt('process.env.DEFAULT_URL_TOKEN_VALID_FOR_MINUTES') // 1 minute

  const _generateQrCode = async (
    validUntilInput: Date,
    blockForMinutesInput: number
  ) => {
    const { data } = await generateUrlToken({
      variables: {
        validUntil: validUntilInput,
        blockForMinutes: blockForMinutesInput,
      },
    })

    if (data && data.generateUrlToken) {
      createStampUrl = `${window.location.origin}/${PATHS.ADD_STAMP}/${data.generateUrlToken.token}`

      validUntil = new Date(data.generateUrlToken.validUntil)
      blockForMinutes = data.generateUrlToken.blockForMinutes
      token = data.generateUrlToken.token

      console.log('QR Code updated', validUntil)
    } else {
      console.error('Error')
    }
  }

  const _getValidUntil = (minutes: number) => {
    const date = new Date(Date.now() + 1000 * 60 * minutes)
    const offsetMinutes = date.getTimezoneOffset()
    date.setMinutes(date.getMinutes() - offsetMinutes)
    return date
  }

  async function generateUrlTokenSubmit(event: SubmitEvent) {
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      _generateQrCode(new Date(validUntilInput), blockForMinutesInput)
    }
  }

  onMount(() => {
    validUntilInput = _getValidUntil(defaultValidForMinutes).toISOString().slice(0, 16)
    const interval = setInterval(() => {
      currentDate = new Date()
      if (token !== '' && validUntil <= currentDate) {
        token = ''
        validUntilInput = _getValidUntil(defaultValidForMinutes).toISOString().slice(0, 16)
        _generateQrCode(new Date(validUntilInput), blockForMinutesInput)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  })
</script>

<SettingsPage title="QR Code">
  {#if token === '' || validUntil <= currentDate}
    <p>Der QR Code ist abgelaufen. Bitte generiere einen neuen.</p>
  {:else}
    <div>
      <a href={createStampUrl} target="_blank" rel="noopener noreferrer"
        >{createStampUrl}</a
      >
      <img src={createQRCodeUrl} alt="QR Code" />
      <div>
        <i>Läuft ab um: {new Date(validUntil).toLocaleString('de-CH')}</i>
      </div>
      <div>
        <i>Blockiert für {blockForMinutes} Minuten</i>
      </div>
    </div>
  {/if}
  <form on:submit|preventDefault={generateUrlTokenSubmit}>
    <label for="longTimeQr">
      <input
        type="checkbox"
        name="longTimeQr"
        id="longTimeQr"
        value={true}
        bind:checked={longTimeQr}
      />
      QR Code für längere Zeit Gültig
    </label>
    {#if longTimeQr}
      <label for="validUntil">Gültig bis</label>
      <input
        type="datetime-local"
        name="validUntil"
        id="validUntil"
        bind:value={validUntilInput}
        required
      />
    {/if}
    <label for="blockForMinutes">QR Code blockieren für [Minuten]</label>
    <input
      type="number"
      name="blockForMinutes"
      id="blockForMinutes"
      bind:value={blockForMinutesInput}
      required
    />
    <button type="submit">QR Code generieren</button>
  </form>
</SettingsPage>
