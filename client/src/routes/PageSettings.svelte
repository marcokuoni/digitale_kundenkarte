<script lang="ts">
  import { onMount } from 'svelte'
  import NavLink from '../components/NavLink.svelte'
  import { PATHS, UserRoles } from '../lib/const'
  import SecuredNavLink from '../components/SecuredNavLink.svelte'
</script>

<main>
  <h1>Einstellungen</h1>
  <div>
    <NavLink to={PATHS.CARD}>Zu meiner Karte</NavLink>
  </div>
  <div>
    <NavLink to={`${PATHS.SETTINGS}/${PATHS.PROFILE}`}>Profil</NavLink>
    <NavLink to={`${PATHS.SETTINGS}/${PATHS.CONNECTED}`}
      >Verbundene Geräte</NavLink
    >
  </div>
  <div>
    <SecuredNavLink
      to={`${PATHS.SETTINGS}/${PATHS.QR_CODE}`}
      requiredRoles={[UserRoles.EMPLOYEE]}>QR Code generieren</SecuredNavLink
    >
  </div>
  <div>
    <SecuredNavLink
      to={`${PATHS.SETTINGS}/${PATHS.IP_BLOCKS}`}
      requiredRoles={[UserRoles.ADMIN]}>Blocked IPs</SecuredNavLink
    >
  </div>
</main>

<style>
</style>
