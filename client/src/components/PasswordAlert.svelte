<script lang="ts">
  import currentUser from '../stores/currentUser'
</script>

{#if $currentUser?.userRoles && $currentUser.userRoles.length > 0}
  {#if !$currentUser.passwordChangedAt || $currentUser.passwordChangedAt < Date.now() - 1000 * 60 * 60 * 24 * 90}
    <p>
      Wir empfehlen dir dringend dein Passwort zu ändern, da es schon länger als
      90 Tage nicht mehr geändert wurde.
    </p>
  {/if}
{/if}
