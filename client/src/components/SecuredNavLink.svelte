<script lang="ts">
  import { onMount } from 'svelte'
  import NavLink from './NavLink.svelte'
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

  export let to: string = ''
  export let requiredRoles: string[] = []
</script>

{#if $currentUserLoading}
  <!-- TODO: we need a way to communicate loading and alert states to the user? -->
  <span>Loading...</span>
{:else if $currentUserError}
  <span>Error: {$currentUserError}</span>
{:else if checkAccessRights($currentUser, requiredRoles)}
  <NavLink to={to}>
    <slot />
  </NavLink>
{/if}
