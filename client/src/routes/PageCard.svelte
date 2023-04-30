<script lang="ts">
  import Card from '../components/Card.svelte'
  import CardSettings from '../components/CardSettings.svelte'
  import Logout from '../components/Logout.svelte'
  import { PATHS } from '../lib/const.js'
  import NavLink from '../components/NavLink.svelte'
  import {
    currentUser,
    fetchCurrentUser,
    currentUserLoading,
    currentUserError,
  } from '../stores/currentUser'
  import { onMount } from 'svelte'
  import HonourQrCode from '../components/HonourQrCode.svelte'
  import { formatRelativeTimeS } from '../lib/formater'

  onMount(() => {
    fetchCurrentUser()
  })
  let settingsOverlayVisible = false
  const stampsLength = parseInt('process.env.STAMPS_LENGTH' || '8')

  function toggleOverlayVisibility() {
    settingsOverlayVisible = !settingsOverlayVisible
  }

  $: stampCount = ($currentUser && $currentUser.cards[0].stamps.length) || 0
  $: stamps = ($currentUser && $currentUser.cards[0].stamps) || []
  $: hasAFullCard =
    ($currentUser &&
      $currentUser.cards.filter(
        (card) => !card.honouredAt && card.stamps.length === stampsLength
      ).length > 0) ||
    false
  $: timeSpanToLastStamp =
    $currentUser && $currentUser.cards[0].stamps.length > 0
      ? (new Date(
          $currentUser.cards[0].stamps[
            $currentUser.cards[0].stamps.length - 1
          ].creationDate
        ).getTime() -
          new Date().getTime()) /
        1000
      : 0
</script>

<main>
  {#if $currentUserLoading}
    <!-- TODO: we need a way to communicate loading and alert states to the user? -->
    <span>Loading...</span>
  {:else if $currentUserError}
    <span>Error: {$currentUserError}</span>
  {:else}
    <section class="card-section">
      <div class="card-wrapper">
        <Card {stamps} />
      </div>
      <button class="all-cards-button">ALLE KARTEN</button>
    </section>

    <section class="info-section">
      <div class="info-wrapper">
        <!-- TODO: Make uppercase by css-->
        <p class="info-label">NAME</p>
        {#if $currentUser && $currentUser.name}
          <p class="info-text">Hallo {$currentUser.name}</p>
        {/if}

        <div class="info-group">
          <div>
            <p class="info-label">STEMPEL</p>
            <p class="info-text">
              {stampCount}<span class="stamps-secondary-text">/ 8</span>
            </p>
          </div>
          <div>
            <p class="info-label">LETZTER</p>
            {#if timeSpanToLastStamp !== 0}
              <p class="info-text">
                {formatRelativeTimeS(timeSpanToLastStamp)}
              </p>
            {/if}
          </div>
        </div>
      </div>
    </section>

    <section class="footer-section">
      <div class="footer">
        <NavLink to={PATHS.SETTINGS}>Einstellungen</NavLink>
        <button on:click={toggleOverlayVisibility}>EINSTELLUNGEN</button>
        <a href="https://thecrownbar.ch">WEBSITE</a>
        <a href="https://instagram.com/thecrownbarrappi">INSTAGRAM</a>
        <Logout />
        {#if hasAFullCard}
          <HonourQrCode transfercode={$currentUser.transfercode} />
        {/if}
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
