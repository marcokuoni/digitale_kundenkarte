<script lang="ts">
  import { PATHS, TARGETS } from '../lib/const'
  import currentUser from '../stores/currentUser'
</script>

<h3>Tipp</h3>
<ul>
  <li>
    <p>
      Speichere dein Transfercode und Passwort in einen Passwort Manager.
    </p>
  </li>
  {#if $currentUser && (!$currentUser.emailValidatedAt || !$currentUser.email)}
    <li>
      <p>
        Es empfiehlt sich eine validierte E-Mailadresse dem Profil zu
        hinterlegen <br />
        <a href={`/${PATHS.SETTINGS}/${PATHS.PROFILE}`} target={TARGETS.SELF}
          >E-Mailladresse hinterlegen</a
        >
      </p>
    </li>
  {/if}
</ul>

<style>
  ul {
    padding-left: 12px;
    margin-bottom: 15px;
  }
  li {
    padding: 0;
  }

  li p {
    margin: 0;
  }

  h3, ul {
    opacity: 0.5;
    font-size: 0.75rem;
    font-style: italic;
  }
  
  a,
  a:visited,
  a:active,
  a:hover {
    color: var(--white);
  }
</style>
