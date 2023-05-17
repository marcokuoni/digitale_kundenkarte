<script lang="ts">
  import type { Stamp } from '../codegen'

  export let status = false
  export let stamp: Stamp | null = null
</script>

<div
  class="stamp"
  class:active-stamp={status}
  class:provision-stamp-image={!!stamp?.validUntilDate}>

  <svg class="stamp-image" class:hide-stamp-image={!status}
       width="21" height="14" viewBox="0 0 21 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.48936 14H0V3.87234L8.48936 14Z" fill="white"/>
    <path d="M12.5106 14H21V3.87234L12.5106 14Z" fill="white"/>
    <path d="M10.4383 0L4.66207 6.85315L10.4383 13.7063L16.2145 6.85315L10.4383 0Z" fill="white"/>
  </svg>

  {#if stamp?.validUntilDate}
    <span>{stamp?.validUntilDate}</span>
  {/if}
</div>

<style>
  .stamp {
    width: 15%;
    aspect-ratio: 1;
    margin-right: 4%;
    margin-bottom: 4%;

    display: flex;
    justify-content: center;
    align-items: center;

    border: 1px dashed var(--accent-color);
    border-radius: 100%;
  }

  .active-stamp {
    background-color: var(--accent-color);
  }

  .stamp-image {
    width: 50%;
    margin-top: -5%;
  }

  .hide-stamp-image {
    display: none;
  }

  .provision-stamp-image {
    filter: grayscale(100%);
  }
</style>
