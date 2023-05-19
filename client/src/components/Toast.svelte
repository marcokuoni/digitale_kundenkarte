<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import { KIND, ROLES } from '../lib/const'

  export let kind: KIND = KIND.DEFAULT
  export let autoHideDuration = 0
  export let id = 0

  const dispatch = createEventDispatcher()
  let timeId = null

  const close = () => {
    dispatch('close', {
      id,
    })
  }

  onMount(() => {
    if (autoHideDuration > 0) {
      timeId = setTimeout(close, autoHideDuration)
    }
  })

  onDestroy(() => {
    if (timeId) {
      clearTimeout(timeId)
    }
  })
</script>

<div class={`toast ${kind}`} role={ROLES.ALERT}>
  <div class="content">
    <slot />
  </div>
  <button title="Close" tabindex="0" on:click={close}>
    <svg
      data-baseweb="icon"
      viewBox="0 0 24 24"
      role={ROLES.BUTTON}
      class="dd de df l9 la cr jm ck"
      ><title>Close</title><path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.29289 7.29289C7.68342 6.90237 8.31658 6.90237 8.70711 7.29289L12 10.5858L15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289C17.0976 7.68342 17.0976 8.31658 16.7071 8.70711L13.4142 12L16.7071 15.2929C17.0976 15.6834 17.0976 16.3166 16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071L12 13.4142L8.70711 16.7071C8.31658 17.0976 7.68342 17.0976 7.29289 16.7071C6.90237 16.3166 6.90237 15.6834 7.29289 15.2929L10.5858 12L7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289Z"
      /></svg
    >
  </button>
</div>

<style>
  .toast {
    box-shadow: rgba(0, 0, 0, 0.16) 0px 4px 16px;
    width: 288px;
    height: auto;

    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
    transition-property: all;

    padding: 16px;
    border-radius: 12px;
    margin-top: 8px;
    margin-bottom: 8px;

    display: flex;
    justify-content: space-between;
  }

  .toast.default {
    background-color: var(--default-color, rgb(39, 110, 241));
    color: var(--foreground-color, rgb(255, 255, 255));
  }
  .toast.positive {
    background-color: var(--positive-color, rgb(4, 136, 72));
    color: var(--foreground-color, rgb(255, 255, 255));
  }
  .toast.warning {
    background-color: var(--warning-color, rgb(255, 192, 67));
    color: var(--black, rgb(0, 0, 0));
  }
  .toast.negative {
    background-color: var(--negative-color, rgb(225, 25, 0));
    color: var(--foreground-color, rgb(255, 255, 255));
  }

  .toast .content {
    width: 100%;
  }

  .toast button {
    background: none;
    padding: 0;
    padding-inline: 0;
    border: 0;

    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: currentcolor;
    fill: currentcolor;
    cursor: pointer;
  }
  .toast button:hover,
  .toast button:focus {
    background: none;
  }

  .toast button:focus {
    outline: 0 none;
    outline-offset: 0;
  }

  .toast button:active {
    transform: none;
  }
</style>
