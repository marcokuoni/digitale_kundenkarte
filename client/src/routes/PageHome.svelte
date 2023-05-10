<script lang="ts">
  import NavLink from '../components/NavLink.svelte'
  import { onDestroy, onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import { refresh } from '../codegen'
  import { PATHS } from '../lib/const'
  import currentUser from '../stores/currentUser'

  onMount(async () => {
    try {
      await refresh({})
    } catch (e) {
      console.error(e.message)
    }
  })

  const unsubscribe = currentUser.subscribe((currentUser) => {
    if (currentUser && (!currentUser.userRoles || currentUser.userRoles.length === 0)) {
      navigate('/card')
    }
  })

  onDestroy(unsubscribe)
</script>

<nav>
  <NavLink to="query">Query</NavLink>
  <NavLink to="mutation">Mutation</NavLink>
</nav>

<h1>Home page</h1>
<nav>
  <NavLink to={PATHS.CREATE_USER}>Ich möchte eine Karte erstellen</NavLink>
  <NavLink to={PATHS.LOGIN_USER}>Ich besitze bereits eine Karte</NavLink>
</nav>
