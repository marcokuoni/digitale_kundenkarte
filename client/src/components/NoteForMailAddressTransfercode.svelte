<script lang="ts">
  import { PATHS } from '../lib/const'
  import currentUser from '../stores/currentUser'
  import NavLink from './NavLink.svelte'
</script>

<p>Tipp: Speichere dein Transfercode und Passwort in einen Passwort Manager.</p>

{#if $currentUser && (!$currentUser.emailValidatedAt || !$currentUser.email)}
  <p>
    Zudem empfiehlt es sich eine validierte E-Mailadresse dem Profil zu
    hinterlegen
  </p>
  <NavLink to={`/${PATHS.SETTINGS}/${PATHS.PROFILE}`}>Profil</NavLink>
{/if}


<style>

  p {
    opacity: 0.5;
  }

</style>