<script lang="ts">
  import { PROCESS_ENV } from '../lib/const'
  import alerts from '../stores/alerts'
  import Toast from './Toast.svelte'

  const autoHideDuration = parseInt(
    PROCESS_ENV.TOAST_AUTO_HIDE_DURATION
  ) || 5000

  $: toastEntries = []

  alerts.subscribe((alertMap) => {
    toastEntries = Array.from(alertMap.entries())
  })

  function handleClose(event) {
    alerts.removeAlert(event.detail.id)
  }
</script>

<div class="toast-container">
  {#each toastEntries as [key, value]}
    <Toast kind={value.kind} id={key} on:close={handleClose} autoHideDuration={autoHideDuration}
      >{value.message}</Toast
    >
  {/each}
</div>

<style>
  .toast-container {
    display: flex;
    flex-direction: column-reverse;
    -moz-box-pack: end;
    justify-content: flex-start;

    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    margin-right: 16px;
    margin-bottom: 8px;
  }
</style>
