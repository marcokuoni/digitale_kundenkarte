<script lang="ts">
  import { PATHS } from '../../lib/const'
  import NavLink from '../NavLink.svelte'

  export let title: string = ''
</script>

<main class="default-section">
  <div class="default-wrapper">

    <h1>{title}</h1>

    <slot />

    <NavLink to={`/${PATHS.SETTINGS}`}>Zurück</NavLink>
    <!-- <NavLink to={`/${PATHS.CARD}`}>Zu meiner Karte</NavLink> -->

  </div>
</main>
