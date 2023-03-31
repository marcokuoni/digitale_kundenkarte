<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import GenerateSyncCode from './card-settings/GenerateSyncCode.svelte'
  import ReadSyncCode from './card-settings/ReadSyncCode.svelte'
  import RenameCard from './card-settings/RenameCard.svelte'
  const dispatch = createEventDispatcher()

  export let visible = false

  function toggleOverlay() {
    dispatch('toggleOverlay')
  }

  function handleReadCodeClick() {
    // TODO: fetch user with the corresponding code
  }

  function handleNameChangeClick() {
    // TODO: update card name
  }
</script>

<main>
  {#if visible}
    <button class="overlay" on:click={toggleOverlay}>
      <GenerateSyncCode />
      <ReadSyncCode />
      <RenameCard />

      <button class="close-button">SCHLIESSEN</button>
    </button>
  {/if}
</main>

<style>
  .overlay {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;

    background-color: var(--background-color-transparent);
  }

  :global(.overlay-button) {
    font-weight: bold;
    padding: 8px 12px;
    margin: 8px 0;

    color: var(--foreground-color);
    background-color: var(--accent-color);

    border-radius: 8px;
    border: none;
  }

  .close-button {
    position: absolute;
    bottom: 40px;

    padding: 2px 4px;

    font-size: 8pt;
    font-weight: bold;
    color: var(--secondary-color);
    background-color: transparent;

    border: none;
    text-decoration: none;
  }
</style>
