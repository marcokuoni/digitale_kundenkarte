<script lang="ts">
  import { onMount } from 'svelte'
  import { generateUrlToken } from '../../codegen'
  import MoreRightsPage from '../../components/layouts/MoreRightsPageLayout.svelte'
  import {
    BUTTON_TYPES,
    DE_CH,
    KIND,
    NAMES,
    NOOPENER_NPREFERRER,
    PATHS,
    PROCESS_ENV,
    PRODUCTION,
    QR_CODE_API_URL,
    TARGETS,
  } from '../../lib/const'
  import Separator from '../../components/Separator.svelte'
  import loader from '../../stores/loader'
  import alerts from '../../stores/alerts'
  import Modal, { getModal } from '../../components/Modal.svelte'

  const QR_CODE = 'qr-code'
  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION
  let currentDate = new Date()
  let createStampUrl = `${window.location.origin}/${PATHS.ADD_STAMP}`
  let createQRCodeUrl = `${QR_CODE_API_URL}${createStampUrl}`
  let validUntil = new Date()
  let blockForMinutes = 0
  let longTimeQr = false
  let token = ''
  let validUntilInput = ''

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
    try {
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

        getModal(QR_CODE).open()

        alerts.addAlert(
          KIND.POSITIVE,
          `QR Code wurde erstellt, gültig bis: ${new Date(validUntil).toLocaleString(DE_CH)}`
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

  const _getValidUntil = (minutes: number) => {
    const date = new Date(Date.now() + 1000 * 60 * minutes)
    const offsetMinutes = date.getTimezoneOffset()
    date.setMinutes(date.getMinutes() - offsetMinutes)
    return date
  }

  async function generateUrlTokenSubmit(event: SubmitEvent) {
    loader.setLoader(generateUrlToken.name, true)
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      await _generateQrCode(new Date(validUntilInput), blockForMinutesInput)
    }
    loader.setLoader(generateUrlToken.name, false)
  }

  onMount(() => {
    validUntilInput = _getValidUntil(defaultValidForMinutes)
      .toISOString()
      .slice(0, 16)
    const interval = setInterval(async () => {
      currentDate = new Date()
      if (token !== '' && validUntil <= currentDate) {
        loader.setLoader(generateUrlToken.name, true)
        token = ''
        validUntilInput = _getValidUntil(defaultValidForMinutes)
          .toISOString()
          .slice(0, 16)
        await _generateQrCode(new Date(validUntilInput), blockForMinutesInput)
        loader.setLoader(generateUrlToken.name, false)
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

<MoreRightsPage title="QR Code">
  <Modal id={QR_CODE}>
    <div class="content">
      <h2>Scannen um zu stempeln</h2>
      {#if token === '' || validUntil <= currentDate}
        <p>Der QR Code ist abgelaufen. Bitte generiere einen neuen.</p>
      {:else}
        <div>
          <img src={createQRCodeUrl} alt="QR Code" />
          <div class="link-container">
            <a
              href={createStampUrl}
              target={TARGETS.BLANK}
              rel={NOOPENER_NPREFERRER}>{createStampUrl}</a
            >
          </div>
          <div>
            <i
              ><strong>Läuft ab um:</strong>
              {new Date(validUntil).toLocaleString(DE_CH)}</i
            >
          </div>
          <div>
            <i><strong>Blockiert für:</strong> {blockForMinutes} Minuten</i>
          </div>
        </div>
      {/if}
    </div>
  </Modal>

  <form on:submit|preventDefault={generateUrlTokenSubmit}>
    <p>
      <i>
        Hinweis: Blocking Zeit sollte immer länger dauern als die Gültigkeit.
        Falls beim Scannen kein Internet vorhanden ist. Muss die Gültigkeit
        ausreichen, damit man in zwischen Zeit wieder Internet erlangen kann.
      </i>
    </p>

    <div class="form-input-wrapper">
      <input
        type="checkbox"
        name={NAMES.LONG_TIME_QR}
        id={NAMES.LONG_TIME_QR}
        value={true}
        bind:checked={longTimeQr}
      />
      <label for={NAMES.LONG_TIME_QR}> Manuelle Gültigkeit (Default: {new Date(validUntilInput).toLocaleString(DE_CH)}) </label>
    </div>

    {#if longTimeQr}
      <div class="form-input-wrapper">
        <label for={NAMES.VALID_UNTIL}>Gültig bis</label>
        <input
          class="full-width-input"
          type="datetime-local"
          name={NAMES.VALID_UNTIL}
          id={NAMES.VALID_UNTIL}
          bind:value={validUntilInput}
          required
        />
      </div>
    {/if}

    <div class="form-input-wrapper">
      <label for={NAMES.BLOCK_FOR_MINUTES}>
        Blockieren in min (Empfohlen > {_getMinTimeDiff(validUntilInput)})
      </label>
      <input
        class="full-width-input"
        type="number"
        name={NAMES.BLOCK_FOR_MINUTES}
        id={NAMES.BLOCK_FOR_MINUTES}
        bind:value={blockForMinutesInput}
        required
      />

      <button
        class="default-button full-width-button"
        type={BUTTON_TYPES.SUBMIT}>QR Code generieren</button
      >
    </div>
  </form>

  <Separator>oder</Separator>
</MoreRightsPage>

<style>
  form {
    display: flex;
    flex-direction: column;
  }

  .form-input-wrapper {
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

  .full-width-input {
    width: calc(100% - 24px);
  }

  .full-width-button {
    width: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .content .link-container {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: var(--qr-width);
    margin: 0 auto;
    margin-bottom: 30px;
  }

  .content a,
  .content a:visited,
  .content a:hover,
  .content a:active {
    color: var(--white);
    word-wrap: anywhere;
    font-size: 0.75rem;
    line-height: 1;
  }

  .content img {
    margin: 0 auto;
    margin-bottom: 5px;
  }

  .content img,
  .content a {
    margin-top: 15px;
  }
</style>
