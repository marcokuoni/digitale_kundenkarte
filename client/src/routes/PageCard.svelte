<script lang="ts">
  import Card from '../components/Card.svelte'
  import Logout from '../components/Logout.svelte'
  import { PATHS, PROCESS_ENV } from '../lib/const.js'
  import NavLink from '../components/NavLink.svelte'
  import currentUser from '../stores/currentUser'
  import HonourQrCode from '../components/HonourQrCode.svelte'
  import { formatRelativeTimeS } from '../lib/formater'
  import { onDestroy } from 'svelte'
  import { navigate } from 'svelte-routing'
  import EmailAlert from '../components/EmailAlert.svelte'
  import NoteForMailAddressTransfercode from '../components/NoteForMailAddressTransfercode.svelte'

  const stampsLength = parseInt(PROCESS_ENV.STAMPS_LENGTH || '8')

  const unsubscribe = currentUser.subscribe((currentUser) => {
    if (
      currentUser &&
      currentUser.userRoles &&
      currentUser.userRoles.length > 0
    ) {
      navigate(`/${PATHS.HOME}`)
    }
  })

  onDestroy(unsubscribe)

  $: stampCount =
    ($currentUser &&
      $currentUser.cards[0] &&
      $currentUser.cards[0].stamps.length) ||
    0
  $: stamps =
    ($currentUser && $currentUser.cards[0] && $currentUser.cards[0].stamps) ||
    []
  $: hasAFullCard =
    ($currentUser &&
      $currentUser.cards.filter(
        (card) => !card.honouredAt && card.stamps.length === stampsLength
      ).length > 0) ||
    false
  $: timeSpanToLastStamp =
    $currentUser &&
    $currentUser.cards[0] &&
    $currentUser.cards[0].stamps.length > 0
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
  <EmailAlert>
  {#if !$currentUser}
    <!-- TODO: we need a way to communicate loading and alert states to the user? -->
    <span>Loading...</span>
    <Logout />
  {:else}
    <section class="card-section">
      <div class="card-wrapper">
        <Card {stamps} />
      </div>
    </section>

    <section class="info-section">
      <div class="info-wrapper">
        {#if $currentUser && $currentUser.name}
        <p class="info-label">Name</p>
          <p class="info-text">Hallo {$currentUser.name}</p>
        {/if}
        <p class="info-label">Transfercode</p>
        {#if $currentUser}
          <p class="info-text">{$currentUser.transfercode}</p>
        {/if}

        <div class="info-group">
          <div>
            <p class="info-label">Stempel</p>
            <p class="info-text">
              {stampCount}<span class="stamps-secondary-text">/ 8</span>
            </p>
          </div>
          <div>
            <p class="info-label">Letzter</p>
            {#if timeSpanToLastStamp !== 0}
              <p class="info-text">
                {formatRelativeTimeS(timeSpanToLastStamp)}
              </p>
            {/if}
          </div>
        </div>

        {#if $currentUser.cards.length > 0}
          <div class="info-group">
            <div>
              <p class="info-label">Einzulösende Karten</p>
              <p class="info-text">
                {$currentUser.cards.filter(
                  (card) =>
                    !card.honouredAt && card.stamps.length === stampsLength
                ).length}<span class="stamps-secondary-text"
                  >/ {$currentUser.cards.length}</span
                >
              </p>
            </div>
          </div>
        {/if}
      </div>
    </section>

    <section class="default-section footer">
      <div class="default-wrapper">
<!--        <NoteForMailAddressTransfercode />-->
<!--        <NavLink to={`/${PATHS.SETTINGS}`}>Einstellungen</NavLink>-->
        <a href="/settings">SETTINGS</a>
        <Logout />
        <a href="https://thecrownbar.ch">WEBSITE</a>
        <a href="https://instagram.com/thecrownbarrappi">INSTAGRAM</a>
        {#if hasAFullCard}
          <HonourQrCode transfercode={$currentUser.transfercode} />
        {/if}
      </div>
    </section>
  {/if}
</EmailAlert>
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
    text-transform: uppercase;
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

  .footer {
    position: absolute;
    bottom: 40px;

    width: 100vw;
  }

</style>
