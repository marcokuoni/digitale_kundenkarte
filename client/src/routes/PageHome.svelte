<script lang="ts">
  import NavLink from '../components/NavLink.svelte'
  import { onDestroy, onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import { refresh } from '../codegen'
  import { PATHS, PROCESS_ENV, USER_ROLES } from '../lib/const'
  import currentUser from '../stores/currentUser'
  import SecuredNavLink from '../components/SecuredNavLink.svelte'
  import Logout from '../components/Logout.svelte'
  import { checkAccessRights } from '../services/auth'
  import PasswordAlert from '../components/PasswordAlert.svelte'
  import EmailAlert from '../components/EmailAlert.svelte'
  import NoteForMailAddressTransfercode from '../components/NoteForMailAddressTransfercode.svelte'

  let hasMoreRights = false

  const unsubscribe = currentUser.subscribe((currentUser) => {
    if (
      currentUser &&
      (!currentUser.userRoles || currentUser.userRoles.length === 0)
    ) {
      navigate(`/${PATHS.CARD}`)
    } else if (
      currentUser &&
      currentUser.userRoles &&
      currentUser.userRoles.length > 0
    ) {
      hasMoreRights = true
    }
  })

  onDestroy(unsubscribe)
</script>

<main class="default-section">
  <div class="default-wrapper">

    <h1>Startseite</h1>

    <EmailAlert>
      {#if $currentUser}
        <p class="info-text">Dein Transfercode: {$currentUser.transfercode}</p>

        <NoteForMailAddressTransfercode />
      {/if}

      <nav>
        {#if hasMoreRights}
          <SecuredNavLink to={`/${PATHS.QR_CODE}`} requiredRoles={[USER_ROLES.EMPLOYEE]}>
            QR Code generieren
          </SecuredNavLink>

          <SecuredNavLink to={`${PATHS.HONOUR_CARD}`} requiredRoles={[USER_ROLES.EMPLOYEE]}>
            Karte einlösen
          </SecuredNavLink>

          <SecuredNavLink to={`/${PATHS.IP_BLOCKS}`} requiredRoles={[USER_ROLES.ADMIN]}>
            Blockierte IPs
          </SecuredNavLink>

          <SecuredNavLink to={`/${PATHS.USER_ROLES}`} requiredRoles={[USER_ROLES.ADMIN]}>
            Benutzergruppen verwalten
          </SecuredNavLink>

          <PasswordAlert />
          <NavLink to={`/${PATHS.SETTINGS}`}>Einstellungen</NavLink>

        {:else}
          <NavLink to={`/${PATHS.CREATE_USER}`}>Ich möchte eine Karte erstellen</NavLink>

          {#if !$currentUser}
            <NavLink to={`/${PATHS.LOGIN_USER}`}>Ich besitze bereits eine Karte (Anmelden)</NavLink>
          {/if}

        {/if}
        {#if $currentUser}
          <Logout />
        {/if}
      </nav>


    </EmailAlert>

  </div>
</main>
