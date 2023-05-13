<script lang="ts">
  import type { Stamp } from '../codegen'

  export let status = false
  export let stamp: Stamp | null = null
</script>

<div
  class="stamp"
  class:active-stamp={status}
  class:provision-stamp-image={!!stamp?.validUntilDate}
>
  <!-- TODO: Inline Vektor verwenden damit dies besser cached -->
  <img
    src="/images/CRN%20Logo%20Light.svg"
    class="stamp-image"
    class:hide-stamp-image={!status}
    alt="A white crown bar logo"
  />
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
    align-content: center;

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
