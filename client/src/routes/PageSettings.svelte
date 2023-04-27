<script lang="ts">
  import { onMount } from 'svelte'
  import NavLink from '../components/NavLink.svelte'
  import { PATHS, UserRoles } from '../lib/const'
  import { checkAccessRights } from '../services/auth'
  import {
    currentUser,
    fetchCurrentUser,
    currentUserLoading,
    currentUserError,
  } from '../stores/currentUser'

  onMount(() => {
    fetchCurrentUser()
  })
</script>

<main>
  <h1>Einstellungen</h1>
  <NavLink to={`${PATHS.SETTINGS}/${PATHS.PROFILE}`}>Profil</NavLink>
  <NavLink to={`${PATHS.SETTINGS}/${PATHS.CONNECTED}`}
    >Verbundene Geräte</NavLink
  >
  <NavLink to={PATHS.CARD}>Zu meiner Karte</NavLink>
  {#if $currentUserLoading}
    <!-- TODO: we need a way to communicate loading and alert states to the user? -->
    <span>Loading...</span>
  {:else if $currentUserError}
    <span>Error: {$currentUserError}</span>
  {:else if checkAccessRights($currentUser, [UserRoles.ADMIN])}
    <NavLink to={`${PATHS.SETTINGS}/${PATHS.IP_BLOCKS}`}>Blocked IPs</NavLink>
  {/if}
</main>

<style>
</style>
