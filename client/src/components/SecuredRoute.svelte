<script lang="ts">
  import { checkAccessRights } from '../services/auth'
  import currentUser from '../stores/currentUser'
  import { Route } from 'svelte-routing'
  import NavLink from './NavLink.svelte'
  import { PATHS } from '../lib/const'
  import Logout from './Logout.svelte'

  export let path: string = ''
  export let requiredRoles: string[] = []
</script>

<Route {path} let:params>
  {#if !$currentUser}
    <!-- TODO: we need a way to communicate loading and alert states to the user? -->
    <span>Kein Benutzer gefunden</span>
    <NavLink to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}
      >Anmelden mit Passwort</NavLink
    >
  {:else if checkAccessRights($currentUser, requiredRoles)}
    <slot {params} />
  {:else}
    <span>Keine Berechtigung</span>
    <Logout />
    <NavLink to={`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}
      >Anmelden mit Passwort</NavLink
    >
  {/if}
</Route>
