<script lang="ts">
  import NavLink from '../components/NavLink.svelte'
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import { refresh } from '../codegen'

  onMount(() => {
    const refreshQuery = refresh({})
    refreshQuery.subscribe((data) => {
      if (data.error) {
        console.log('error', data.error)
      }
      if (data.loading) {
        console.log('loading...')
      } else {
        if (data.data.refresh) {
          navigate('/card')
        }
      }
    })
  })
</script>

<nav>
  <NavLink to="query">Query</NavLink>
  <NavLink to="mutation">Mutation</NavLink>
</nav>

<h1>Home page</h1>
<nav>
  <NavLink to="create-user">Ich möchte eine Karte erstellen</NavLink>
  <NavLink to="login-user">Ich besitze bereits eine Karte</NavLink>
</nav>
