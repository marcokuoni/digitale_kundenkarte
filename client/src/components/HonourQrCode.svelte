<script lang="ts">
  import {
    BUTTON_TYPES,
    NOOPENER_NPREFERRER,
    PATHS,
    QR_CODE_API_URL,
    TARGETS,
  } from '../lib/const'
  import Modal, { getModal } from './Modal.svelte'

  const HONOUR = 'honour'
  export let transfercode = ''
  let createStampUrl = `${window.location.origin}/${PATHS.HONOUR_CARD}/${transfercode}`
  let createQRCodeUrl = `${QR_CODE_API_URL}${createStampUrl}`
</script>

<button
  class="default-button"
  type={BUTTON_TYPES.BUTTON}
  on:click={() => getModal(HONOUR).open()}
>
  Karte einlösen
</button>
<Modal id={HONOUR}>
  <div class="content">
    <h2>Karte einlösen</h2>
    <img src={createQRCodeUrl} alt="QR Code" />
    <div class="link-container">
      <a href={createStampUrl} target={TARGETS.BLANK} rel={NOOPENER_NPREFERRER}
        >{createStampUrl}</a
      >
    </div>
  </div>
</Modal>

<style>
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

  .content img,
  .content a {
    margin-top: 15px;
  }
</style>
