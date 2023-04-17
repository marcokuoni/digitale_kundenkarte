<script lang="ts">
  import { addUser, getUsers } from '../codegen.js'
  import gql from 'graphql-tag'
  import { getCurrentUser } from '../codegen'
  import Card from '../components/Card.svelte'
  import CardSettings from '../components/CardSettings.svelte'
  import Logout from '../components/Logout.svelte'

  let inputName = ''
  let inputEmail = ''
  let inputNewsletter = false

  $: query = getCurrentUser({
    pollInterval:5000
  })

  let settingsOverlayVisible = false

  function toggleOverlayVisibility() {
    settingsOverlayVisible = !settingsOverlayVisible
  }

  const stampsPlaceholder = [
    new Date('2023-03-02T18:00:00.000Z'),
    new Date('2023-03-09T18:00:00.000Z'),
    new Date('2023-03-16T18:00:00.000Z'),
    new Date('2023-03-23T18:00:00.000Z'),
  ]
</script>

<main>
  {#if $query.loading}
    <!-- TODO: we need a way to communicate loading and alert states to the user? -->
    <span>Loading...</span>
  {:else if $query.error}
    <span>Error: {$query.error.message}</span>
  {:else}
    <section class="card-section">
      <div class="card-wrapper">
        <Card stamps={stampsPlaceholder} />
      </div>
      <button class="all-cards-button">ALLE KARTEN</button>
    </section>

    <section class="info-section">
      <div class="info-wrapper">
        <!-- TODO: Make uppercase by css-->
        <p class="info-label">NAME</p>
        {#if $query.data?.getCurrentUser.name}
          <p class="info-text">Hallo {$query.data?.getCurrentUser.name}</p>
        {/if}

        <div class="info-group">
          <div>
            <p class="info-label">STEMPEL</p>
            <p class="info-text">
              4<span class="stamps-secondary-text">/ 8</span>
            </p>
          </div>
          <div>
            <p class="info-label">LETZTER</p>
            <p class="info-text">vor 12 Tagen</p>
          </div>
        </div>
      </div>
    </section>

    <section class="footer-section">
      <div class="footer">
        <button on:click={toggleOverlayVisibility}>EINSTELLUNGEN</button>
        <a href="https://thecrownbar.ch">WEBSITE</a>
        <a href="https://instagram.com/thecrownbarrappi">INSTAGRAM</a>
        <Logout />
      </div>
    </section>

    <CardSettings
      visible={settingsOverlayVisible}
      on:toggleOverlay={toggleOverlayVisibility}
    />

    <!--     
    {#if $getUsersQuery.loading}
        <p>loading...</p>
    {:else}
        {#if $getUsersQuery.data?.getUsers.length === 0}
            <p>No User (Add some!)</p>
        {/if}
        {#each $getUsersQuery.data?.getUsers || [] as user, i}
            <div>User {i + 1} -&gt; {user.name}</div>
        {/each}
        <button on:click={() => $getUsersQuery.query.refetch({})}>Refresh</button>
    {/if}
    -->

    <!--<button on:click={logUsers}>Log users</button>-->
    <!--
    <p>Add user:</p>
    <input type="text" placeholder="username" bind:value={inputName}/>
    <input type="email" placeholder="email" bind:value={inputEmail}/>
    <input type="checkbox" name="newsletter" bind:checked={inputNewsletter}/>
    <button on:click={handleUserClick} disabled={inputName.length === 0}>Add User</button>
    -->
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 80vh;
  }

  .card-wrapper {
    width: 80vw;
    max-width: 400px;
  }

  .card-section {
    width: 100vw;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  button,
  a {
    cursor: pointer;
    padding: 2px 4px;

    font-size: 8pt;
    font-weight: bold;
    color: var(--secondary-color);
    background-color: transparent;

    border: none;
    text-decoration: none;
  }

  .all-cards-button {
    margin-top: 20px;
  }

  /* info */

  .info-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .info-wrapper {
    width: 80vw;
    max-width: 400px;
    margin: 40px -20px -20px;
  }

  .info-group {
    display: flex;
    margin-top: 20px;
  }

  .info-group div {
    margin-right: 20px;
  }

  .info-label {
    font-size: 9pt;
    font-weight: bold;
    color: var(--accent-color);
  }

  .info-text {
    font-size: 22pt;
    font-family: 'Tiempos Fine', serif;
    font-weight: bold;
  }

  .stamps-secondary-text {
    color: var(--secondary-color);
    font-size: 14pt;
    margin-left: 4px;
  }

  /* footer */

  .footer-section {
    position: absolute;
    bottom: 40px;
    width: 100vw;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer {
    width: 70vw;
    max-width: 400px;
  }
</style>
