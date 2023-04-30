<script lang="ts">
  import { onMount } from 'svelte'
  import { checkAccessRights } from '../services/auth'
  import {
    currentUser,
    fetchCurrentUser,
    currentUserLoading,
    currentUserError,
  } from '../stores/currentUser'
  import { Route } from 'svelte-routing'

  onMount(() => {
    fetchCurrentUser()
  })

  export let path: string = ''
  export let requiredRoles: string[] = []
</script>

<Route {path} let:params>
  {#if $currentUserLoading}
    <!-- TODO: we need a way to communicate loading and alert states to the user? -->
    <span>Loading...</span>
  {:else if $currentUserError}
    <span>Error: {$currentUserError}</span>
  {:else if checkAccessRights($currentUser, requiredRoles)}
    <slot {params} />
  {/if}
</Route>
