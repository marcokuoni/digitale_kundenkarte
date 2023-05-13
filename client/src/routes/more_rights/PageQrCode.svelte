<script lang="ts">
  import { onMount } from 'svelte'
  import { generateUrlToken } from '../../codegen'
  import MoreRightPage from '../../components/layouts/MoreRightPageLayout.svelte'
  import {
    BUTTON_TYPES,
    DE_CH,
    NAMES,
    NOOPENER_NPREFERRER,
    PATHS,
    PROCESS_ENV,
    QR_CODE_API_URL,
    TARGETS,
  } from '../../lib/const'
  import { Wave } from 'svelte-loading-spinners'

  let currentDate = new Date()

  let createStampUrl = `${window.location.origin}/${PATHS.ADD_STAMP}`
  let createQRCodeUrl = `${QR_CODE_API_URL}${createStampUrl}`
  let validUntil = new Date()
  let blockForMinutes = 0
  let longTimeQr = false
  let token = ''
  let validUntilInput = ''
  let loading = false

  let blockForMinutesInput = parseInt(
    PROCESS_ENV.DEFAULT_URL_TOKEN_BLOCK_FOR_MINUTES
  )
  const defaultValidForMinutes = parseInt(
    PROCESS_ENV.DEFAULT_URL_TOKEN_VALID_FOR_MINUTES
  )

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
    loading = true
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      await _generateQrCode(new Date(validUntilInput), blockForMinutesInput)
    }
    loading = false
  }

  onMount(() => {
    validUntilInput = _getValidUntil(defaultValidForMinutes)
      .toISOString()
      .slice(0, 16)
    const interval = setInterval(async () => {
      currentDate = new Date()
      if (token !== '' && validUntil <= currentDate) {
        loading = true
        token = ''
        validUntilInput = _getValidUntil(defaultValidForMinutes)
          .toISOString()
          .slice(0, 16)
        await _generateQrCode(new Date(validUntilInput), blockForMinutesInput)
        loading = false
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  })

  const _getMinTimeDiff = (validUntilInput: string) => {
    return (
      Math.ceil(
        (new Date(validUntilInput).getTime() - currentDate.getTime()) /
          1000 /
          60
      ) || 0
    )
  }
</script>

<MoreRightPage title="QR Code">
  {#if token === '' || validUntil <= currentDate}
    <p>Der QR Code ist abgelaufen. Bitte generiere einen neuen.</p>
  {:else}
    <div>
      <a href={createStampUrl} target={TARGETS.BLANK} rel={NOOPENER_NPREFERRER}
        >{createStampUrl}</a
      >
      <img src={createQRCodeUrl} alt="QR Code" />
      <div>
        <i>Läuft ab um: {new Date(validUntil).toLocaleString(DE_CH)}</i>
      </div>
      <div>
        <i>Blockiert für {blockForMinutes} Minuten</i>
      </div>
    </div>
  {/if}
  {#if loading}
    <Wave size="100" color="#FF3E00" unit="px" />
  {/if}
  <form on:submit|preventDefault={generateUrlTokenSubmit}>
    <p>
      Hinweis: Blocking Zeit sollte immer länger dauern als die Gültigkeit.
      Falls beim Scannen kein Internet vorhanden ist. Muss die Gültigkeit
      ausreichen, damit man in zwischen Zeit wieder Internet erlangen kann.
    </p>
    <label for={NAMES.LONG_TIME_QR}>
      <input
        type="checkbox"
        name={NAMES.LONG_TIME_QR}
        id={NAMES.LONG_TIME_QR}
        value={true}
        bind:checked={longTimeQr}
      />
      QR Code für längere Zeit Gültig
    </label>
    {#if longTimeQr}
      <label for={NAMES.VALID_UNTIL}>Gültig bis</label>
      <input
        type="datetime-local"
        name={NAMES.VALID_UNTIL}
        id={NAMES.VALID_UNTIL}
        bind:value={validUntilInput}
        required
      />
    {/if}
    <label for={NAMES.BLOCK_FOR_MINUTES}
      >QR Code blockieren für [Min] (Empfohlen > {_getMinTimeDiff(
        validUntilInput
      )})</label
    >
    <input
      type="number"
      name={NAMES.BLOCK_FOR_MINUTES}
      id={NAMES.BLOCK_FOR_MINUTES}
      bind:value={blockForMinutesInput}
      required
    />
    <button type={BUTTON_TYPES.SUBMIT}>QR Code generieren</button>
  </form>
</MoreRightPage>
