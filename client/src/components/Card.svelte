<script lang="ts">
  import Stamp from './Stamp.svelte'

  export let stamps: [Date]
  const stampStatuses = []

  // transform the stamps props to a boolean list of their statuses
  for (let i = 0; i < 8; i++) {
    stampStatuses.push(typeof stamps[i] === 'object')
  }
</script>

<div class="card">
  <!--<p class="subtitle">THE CROWN BAR</p>-->
  <h1 class="title">Ehrenkarte</h1>
    <div class="stamp-wrapper">
      {#each stampStatuses as stampStatus}
        <Stamp status={stampStatus} />
      {/each}
      <div class="surprise-wrapper">
        <img
          src="/images/surprise-arrow.svg"
          class="surprise-arrow"
          alt="an arrow pointing left"
        />
        <p>Ehrenhafte<br />Überraschung</p>
      </div>
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
