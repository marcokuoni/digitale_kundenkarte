<script lang="ts">
  import Stamp from './Stamp.svelte'
  const stampsLength = parseInt('process.env.STAMPS_LENGTH' || '8')

  export let stamps: {
    creationDate: Date
    validUntilDate?: number
  }[]

  $: lastVaildUntilDate = stamps
    .filter((stamp) => stamp.validUntilDate)
    .sort(
      (a, b) => b.validUntilDate - a.validUntilDate
    )[0]?.validUntilDate
</script>

<div class="card">
  <!--<p class="subtitle">THE CROWN BAR</p>-->
  <h1 class="title">Ehrenkarte</h1>
  <div class="stamp-wrapper">
    {#each Array(stampsLength) as _, i}
      <Stamp stamp={stamps[i]} status={!!stamps[i]} />
    {/each}
    <div class="surprise-wrapper">
      <svg
        width="14"
        height="4"
        viewBox="0 0 14 4"
        fill="none"
        class="surprise-arrow"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.823223 1.82322C0.725592 1.92085 0.725592 2.07915 0.823223 2.17678L2.41421 3.76777C2.51184 3.8654 2.67014 3.8654 2.76777 3.76777C2.8654 3.67014 2.8654 3.51184 2.76777 3.41421L1.35355 2L2.76777 0.585786C2.8654 0.488155 2.8654 0.329864 2.76777 0.232233C2.67014 0.134602 2.51184 0.134602 2.41421 0.232233L0.823223 1.82322ZM13 2.25C13.1381 2.25 13.25 2.13807 13.25 2C13.25 1.86193 13.1381 1.75 13 1.75V2.25ZM1 2.25H13V1.75H1V2.25Z"
          fill="#B8B8B8"
        />
      </svg>

      <p>Ehrenhafte<br />Überraschung</p>
    </div>
    {#if stamps.length > 0 && lastVaildUntilDate}
      <p class="subtitle">
        Suche Internet bis spätestens {lastVaildUntilDate}
      </p>
    {/if}
  </div>
</div>

<style>
  .card {
    padding: 16px 24px;
    background-color: var(--black);
    box-shadow: 0 0 33px 0 var(--box-shadow);
    border-radius: 4px;
  }

  .title {
    font-family: 'Tiempos Fine', serif;
    font-size: 26pt;
    padding-bottom: 4px;
  }

  .stamp-wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  .surprise-wrapper {
    display: flex;
    align-items: center;
    width: 30%;
    aspect-ratio: 2;
    padding-bottom: 3%;

    color: var(--secondary-color);
    font-size: 8px;
  }

  .surprise-arrow {
    margin-right: 4px;
  }
</style>
