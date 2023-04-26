<script lang="ts">
  import NavLink from '../components/NavLink.svelte'
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import { refresh } from '../codegen'
  import { PATHS } from '../lib/const'

  onMount(async () => {
    try {
      const data = await refresh({})
      if (data.data.refresh) {
        navigate('/card')
      }
    } catch (e) {
      console.error(e.message)
    }
  })
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
