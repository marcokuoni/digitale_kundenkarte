<script lang="ts">
  import { PATHS } from '../../lib/const'
  import Logout from '../Logout.svelte'
  import NavLink from '../NavLink.svelte'

  export let title: string = ''
</script>

<main class="default-section">
  <div class="default-wrapper">

    <h1>{title}</h1>

    <slot />

    <NavLink to={`/${PATHS.HOME}`}>Zurück Startseite</NavLink>
    <Logout />
  </div>

</main>
