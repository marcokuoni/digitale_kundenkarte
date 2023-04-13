<nav>
    <NavLink to="query">Query</NavLink>
    <NavLink to="mutation">Mutation</NavLink>
</nav>

<h1>Home page</h1>
<nav>
    <NavLink to="create-user">Ich möchte eine Karte erstellen</NavLink>
    <NavLink to="login-user">Ich besitze bereits eine Karte</NavLink>
</nav>

<script lang="ts">
    import NavLink from '../components/NavLink.svelte'
    import { onMount } from 'svelte';

    onMount(() => {
        //TODO: call refresh for auto redirect to card by success otherwise stay on home
        // if refresh succes navigate('/card')
    })

</script>
