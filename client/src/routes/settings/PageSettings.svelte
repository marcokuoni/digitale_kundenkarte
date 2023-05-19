<script lang="ts">
  import { onDestroy } from 'svelte'
  import NavLink from '../../components/NavLink.svelte'
  import { PATHS } from '../../lib/const'
  import currentUser from '../../stores/currentUser'
  import Separator from '../../components/Separator.svelte'
  import Logout from '../../components/Logout.svelte'

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
      <NavLink to={`/${PATHS.SETTINGS}/${PATHS.PROFILE}`}>Profil</NavLink>
      <NavLink to={`/${PATHS.SETTINGS}/${PATHS.CONNECTED}`}>Verbundene Geräte</NavLink>
    </div>

    <Separator>oder</Separator>

    <div>
      {#if hasMoreRights}
        <NavLink to={`/${PATHS.HOME}`}>Zurück zur Startseite</NavLink>
      {:else}
        <NavLink to={`/${PATHS.CARD}`}>Zurück zu meiner Karte</NavLink>
      {/if}
      <Logout />
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
