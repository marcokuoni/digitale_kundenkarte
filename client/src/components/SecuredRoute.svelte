<script lang="ts">
  import { checkAccessRights } from '../services/auth'
  import currentUser from '../stores/currentUser'
  import { Route } from 'svelte-routing'

  export let path: string = ''
  export let requiredRoles: string[] = []
</script>

<Route {path} let:params>
  {#if !$currentUser}
    <!-- TODO: we need a way to communicate loading and alert states to the user? -->
    <span>Kein Benutzer gefunden</span>
  {:else if checkAccessRights($currentUser, requiredRoles)}
    <slot {params} />
  {/if}
</Route>
