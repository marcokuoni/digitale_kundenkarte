<script lang="ts">
  import {
    MAIL_TO,
    NOOPENER_NPREFERRER,
    PROCESS_ENV,
    TARGETS,
  } from '../lib/const'
</script>

<p>
  Diese Funktion läuft nur wenn dem Profil eine validierte E-Mailadresse
  hinterlegt ist. <br />
  Ansonsten wende dich an
  <a
    href={`${MAIL_TO}${PROCESS_ENV.ADMIN_EMAIL_ADDRESS}`}
    target={TARGETS.BLANK}
    rel={NOOPENER_NPREFERRER}>{PROCESS_ENV.ADMIN_EMAIL_ADDRESS}</a
  >
</p>

<style>
  p {
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
