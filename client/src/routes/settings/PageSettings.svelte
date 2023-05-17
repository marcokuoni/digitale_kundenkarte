<script lang="ts">
  import { onDestroy } from 'svelte'
  import NavLink from '../../components/NavLink.svelte'
  import { PATHS } from '../../lib/const'
  import currentUser from '../../stores/currentUser'

  let hasMoreRights = false
  const unsubscribe = currentUser.subscribe((currentUser) => {
    if (
      currentUser &&
      currentUser.userRoles &&
      currentUser.userRoles.length > 0
    ) {
      hasMoreRights = true
    }
  })

  onDestroy(unsubscribe)
</script>

<main class="default-section">
  <div class="default-wrapper">

    <h1>Einstellungen</h1>
    <div>
      {#if hasMoreRights}
        <NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>
      {:else}
        <NavLink to={`/${PATHS.CARD}`}>Zu meiner Karte</NavLink>
      {/if}
    </div>
    <div>
      <NavLink to={`/${PATHS.SETTINGS}/${PATHS.PROFILE}`}>Profil</NavLink>
      <NavLink to={`/${PATHS.SETTINGS}/${PATHS.CONNECTED}`}
      >Verbundene Geräte</NavLink
      >
    </div>

  </div>
</main>

<style>

  main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 80vh;
  }

</style>
