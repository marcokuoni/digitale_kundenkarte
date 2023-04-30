<script lang="ts">
  import { PATHS } from '../lib/const'
  import NavLink from './NavLink.svelte'

  export let title: string = ''
</script>

<main>
  <h1>{title}</h1>

  <NavLink to={PATHS.SETTINGS}>Einstellungen</NavLink>
  <NavLink to={PATHS.CARD}>Zu meiner Karte</NavLink>

  <section>
    <slot />
  </section>
</main>
