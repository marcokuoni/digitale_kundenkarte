<script lang="ts">
  import { PATHS } from '../lib/const'
  import Modal, { getModal } from './Modal.svelte'

  export let transfercode = ''
  let createStampUrl = `${window.location.origin}/${PATHS.HONOUR_CARD}/${transfercode}`
  let createQRCodeUrl =
    'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' +
    createStampUrl
</script>

<button type="button" on:click={() => getModal().open()}> Karte einlösen </button>
<Modal>
    <a href={createStampUrl} target="_blank" rel="noopener noreferrer"
      >{createStampUrl}</a
    >
  <img src={createQRCodeUrl} alt="QR Code" />
</Modal>
