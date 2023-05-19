<script lang="ts">
  import Logout from '../Logout.svelte'

  export let title: string = ''
</script>

<main class="default-section">
  <div class="default-wrapper">

    <h1>{title}</h1>

    <slot />

    <button class="default-button" on:click={() => history.back()}>Zurück</button>
    <Logout />
  </div>
</main>
