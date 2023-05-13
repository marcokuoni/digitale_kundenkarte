<script lang="ts">
  import { BUTTON_TYPES, NOOPENER_NPREFERRER, PATHS, QR_CODE_API_URL, TARGETS } from '../lib/const'
  import Modal, { getModal } from './Modal.svelte'

  const HONOUR = 'honour'
  export let transfercode = ''
  let createStampUrl = `${window.location.origin}/${PATHS.HONOUR_CARD}/${transfercode}`
  let createQRCodeUrl = `${QR_CODE_API_URL}${createStampUrl}`
</script>

<button type={BUTTON_TYPES.BUTTON} on:click={() => getModal(HONOUR).open()}> Karte einlösen </button>
<Modal id={HONOUR}>
    <a href={createStampUrl} target={TARGETS.BLANK} rel={NOOPENER_NPREFERRER}
      >{createStampUrl}</a
    >
  <img src={createQRCodeUrl} alt="QR Code" />
</Modal>
