<script lang="ts">
  import NavLink from './NavLink.svelte'
  import { checkAccessRights } from '../services/auth'
  import currentUser from '../stores/currentUser'

  export let to: string = ''
  export let requiredRoles: string[] = []
</script>

{#if !$currentUser}
  <!-- TODO: we need a way to communicate loading and alert states to the user? -->
  <span>Kein Benutzer gefunden</span>
{:else if checkAccessRights($currentUser, requiredRoles)}
  <NavLink to={to}>
    <slot />
  </NavLink>
{/if}
