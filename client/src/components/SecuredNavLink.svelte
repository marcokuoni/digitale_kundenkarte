<script lang="ts">
  import NavLink from './NavLink.svelte'
  import { checkAccessRights } from '../services/auth'
  import currentUser from '../stores/currentUser'
  import Logout from './Logout.svelte'
  import { PATHS } from '../lib/const'

  export let to: string = ''
  export let requiredRoles: string[] = []
</script>

{#if !$currentUser}
  <!-- TODO: we need a way to communicate loading and alert states to the user? -->
  <span>Kein Benutzer gefunden</span>
  <NavLink to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}
    >Anmelden mit Passwort</NavLink
  >
{:else if checkAccessRights($currentUser, requiredRoles)}
  <NavLink {to}>
    <slot />
  </NavLink>
{:else}
  <span>Keine Berechtigung</span>
  <Logout />
  <NavLink to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}
    >Anmelden mit Passwort</NavLink
  >
{/if}
