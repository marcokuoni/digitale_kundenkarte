<script context="module" lang="ts">
  let onTop
  const modals = {}

  export function getModal(id = '') {
    return modals[id]
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { EVENTS, KEYS, OVERFLOW, ROLES } from '../lib/const'

  let topDiv
  let visible = false
  let prevOnTop
  let closeCallback

  export let id = ''

  function keyPress(ev) {
    if (ev.key == KEYS.ESCAPE && onTop == topDiv) {
      close()
    }
  }

  function open(callback) {
    closeCallback = callback
    if (visible) return
    prevOnTop = onTop
    onTop = topDiv
    window.addEventListener(EVENTS.KEYDOWN, keyPress)

    document.body.style.overflow = OVERFLOW.HIDDEN

    visible = true

    document.body.appendChild(topDiv)
  }

  function close() {
    if (!visible) return
    window.removeEventListener(EVENTS.KEYDOWN, keyPress)
    onTop = prevOnTop
    if (onTop == null) document.body.style.overflow = ''
    visible = false
    if (closeCallback) closeCallback()
  }

  modals[id] = { open, close }

  onDestroy(() => {
    delete modals[id]
    window.removeEventListener(EVENTS.KEYDOWN, keyPress)
  })
</script>

<div
  id="topModal"
  class:visible
  bind:this={topDiv}
  on:click={() => close()}
  on:keydown={keyPress}
>
  <div id="modal" on:click|stopPropagation={() => {}} on:keydown={keyPress}>
    <button class="btn" id="close" on:click={() => close()}>
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
    <div id="modal-content">
      <slot />
    </div>
  </div>
</div>

<style>
  #topModal {
    visibility: hidden;
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--background-color-transparent);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #modal {
    position: relative;
    border-radius: 6px;
    background-color: var(--black);
    border: 2px solid var(--black);
    box-shadow: 0 0 33px 0 var(--box-shadow);
    padding: 1em;
  }

  .visible {
    visibility: visible !important;
  }

  #close {
    position: absolute;
    top: -12px;
    right: -12px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    fill: var(--accent-color);
  }

  #close line {
    stroke: var(--foreground-color);
    stroke-width: 2;
  }
  #modal-content {
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
    overflow: auto;
  }

  .btn {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }
</style>
