<script lang="ts">
  import Card from '../components/Card.svelte'
  import Logout from '../components/Logout.svelte'
  import {
    NOOPENER_NPREFERRER,
    PATHS,
    PROCESS_ENV,
    TARGETS,
  } from '../lib/const.js'
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
      <span>Kein Benutzer gefunden</span>
      <Logout />
    {:else}
      <section class="default-section">
        <div class="card-wrapper">
          <Card {stamps} />
        </div>
      </section>

      <section class="default-section">
        <div class="info-wrapper">
          {#if $currentUser && $currentUser.name}
            <h4 class="info-label">Name</h4>
            <p class="info-text">{$currentUser.name}</p>
          {/if}

          <h4 class="info-label">Transfercode</h4>
          {#if $currentUser}
            <p class="info-text">{$currentUser.transfercode}</p>
          {/if}

          <div class="info-group">
            <div>
              <h4 class="info-label">Stempel</h4>
              <p class="info-text">
                {stampCount}<span class="stamps-secondary-text">/ 8</span>
              </p>
            </div>

            <div>
              <h4 class="info-label">Letzter</h4>
              {#if timeSpanToLastStamp !== 0}
                <p class="info-text">
                  {timeSpanToLastStamp
                    ? formatRelativeTimeS(timeSpanToLastStamp)
                    : '-'}
                </p>
              {/if}
            </div>
          </div>

          {#if $currentUser.cards.length > 0}
            <div class="info-group">
              <div>
                <h4 class="info-label">Einzulösende Karten</h4>
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
          {#if hasAFullCard}
            <div>
              <HonourQrCode transfercode={$currentUser.transfercode} />
            </div>
          {:else}
            <NoteForMailAddressTransfercode />
          {/if}
          <div class="second-row">
            <div class="left">
              <a href={`/${PATHS.SETTINGS}`} target={TARGETS.SELF}
                >Einstellungen</a
              >
              <Logout />
            </div>
            <div class="right">
              <a
                href={PROCESS_ENV.CROWN_BAR_URL}
                target={TARGETS.BLANK}
                rel={NOOPENER_NPREFERRER}>Website</a
              >
              <a
                href={PROCESS_ENV.CROWN_BAR_INSTA}
                target={TARGETS.BLANK}
                rel={NOOPENER_NPREFERRER}>Instagram</a
              >
            </div>
          </div>
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
    justify-content: space-between;
    min-height: calc(100vh - 40px);
  }

  .card-wrapper,
  .info-wrapper {
    width: 80vw;
    max-width: 400px;
  }

  a {
    text-transform: uppercase;
    cursor: pointer;
    padding: 2px 4px;

    font-size: 0.75rem;
    font-weight: bold;
    color: var(--secondary-color);
    background-color: transparent;

    border: none;
    text-decoration: none;
  }

  /* info */
  .info-group {
    display: flex;
  }

  .info-group div {
    margin-right: 20px;
  }

  .info-text {
    font-size: 1.7rem;
    font-family: 'Tiempos Fine', serif;
    font-weight: bold;
  }

  .stamps-secondary-text {
    color: var(--secondary-color);
    font-size: 1rem;
    margin-left: 4px;
  }

  .second-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .second-row .right {
    text-align: right;
  }
</style>
