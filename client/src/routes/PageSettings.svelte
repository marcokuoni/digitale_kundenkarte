<script lang="ts">
  import NavLink from '../components/NavLink.svelte'
  import { PATHS } from '../lib/const'
</script>

<main>
  <h1>Einstellungen</h1>
  <NavLink to={`${PATHS.SETTINGS}/${PATHS.PROFILE}`}>Profil</NavLink>
  <NavLink to={`${PATHS.SETTINGS}/${PATHS.CONNECTED}`}>Verbundene Geräte</NavLink>
  <NavLink to={PATHS.CARD}>Zu meiner Karte</NavLink>
</main>

<style>
  </style>
