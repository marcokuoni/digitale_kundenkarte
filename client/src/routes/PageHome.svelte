<nav>
    <NavLink to="query">Query</NavLink>
    <NavLink to="mutation">Mutation</NavLink>
</nav>

<h1>Home page</h1>
<nav>
    <NavLink to="create-user">Ich möchte eine Karte erstellen</NavLink>
    <NavLink to="open-card">Ich besitze bereits eine Karte</NavLink>
</nav>

<script>
    import NavLink from '../components/NavLink.svelte'

    //TODO: call refresh for auto redirect to card by success otherwise stay on home
</script>
