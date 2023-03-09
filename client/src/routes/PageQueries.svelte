<script lang="ts">
  import { fade } from 'svelte/transition';
  import { GetMovies } from '../codegen';
  import { Wave } from 'svelte-loading-spinners';

  $: query = GetMovies({});
</script>

<style>
  .cards {
    display: flex;
    justify-content: space-around;
  }

  .card {
    padding: 10px;
    background-color: rgb(173, 196, 178);
    box-shadow: 10px 5px 5px #ff3e00;
  }
</style>

<br />
<main class="cards">
  <div class="card">
    <h2>SpaceX all launches</h2>
    {#if $query.loading}
      <Wave size="100" color="#FF3E00" unit="px" />
    {/if}
    {#each $query.data?.movies || [] as movie (movie._id)}
      <div transition:fade>
        {movie.title}
      </div>
    {/each}
  </div> 
</main>
