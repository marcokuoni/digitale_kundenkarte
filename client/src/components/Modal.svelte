<script context="module" lang="ts">
  let onTop
  const modals = {}

  export function getModal(id = '') {
    return modals[id]
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { EVENTS, KEYS, OVERFLOW } from '../lib/const'

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
      <svg viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="6" />
        <line x1="3" y1="3" x2="9" y2="9" />
        <line x1="9" y1="3" x2="3" y2="9" />
      </svg>
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
