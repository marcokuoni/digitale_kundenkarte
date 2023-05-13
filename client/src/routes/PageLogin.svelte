<script lang="ts">
  import { signIn } from '../codegen'
  import { PATHS, PROCESS_ENV } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import currentUser from '../stores/currentUser'
  import Logout from '../components/Logout.svelte'
  import { formatRelativeTimeS } from '../lib/formater'

  export let withPassword: string = ''

  const blockinDurationInMs =
    parseInt(PROCESS_ENV.BLOCKING_DURATION_MS) > 0
      ? Math.ceil(parseInt(PROCESS_ENV.BLOCKING_DURATION_MS) / 1000)
      : 0
  let transfercode = ''
  let password = ''

  async function loginUser() {
    try {
      const { data } = await signIn({
        variables: {
          transfercode,
          password,
          successRedirect: `/${PATHS.CARD}`,
        },
      })
      if (data && data.signIn) {
        console.error(
          'This should not happen otherwise the browser will cache the input data'
        )
      } else {
        alert('Error')
      }
    } catch (e) {
      if (e.message.indexOf('Received status code 503') >= 0) {
        alert(
          `Der Server ist gerade nicht erreichbar. Vermutlich wurdest du für ${formatRelativeTimeS(
            blockinDurationInMs
          )} gesperrt.`
        )
      } else {
        console.error('wrong transfercode or password')
      }
      console.error(e)
    }
  }
</script>

<h1>Anmelden</h1>
{#if $currentUser}
  <Logout />
{:else}
  <form on:submit|preventDefault={loginUser}>
    <label for="transfercode">Transfer Code</label>
    <input type="text" id="transfercode" required bind:value={transfercode} />
    {#if withPassword !== ''}
      <label for="password">Passwort</label>
      <input type="password" id="password" required bind:value={password} />
    {/if}
    <button type="submit">Anmelden</button>
  </form>

  {#if withPassword !== ''}
    <NavLink to={`/${PATHS.FORGOT_PASSWORD}`}>Passwort vergessen</NavLink>
  {:else}
    <NavLink to={`/${PATHS.CREATE_USER}`}
      >Ich möchte eine Karte erstellen</NavLink
    >
  {/if}
{/if}
{#if withPassword !== ''}
  <NavLink to={`/${PATHS.CREATE_USER}/${PATHS.WITH_PASSWORD}`}
    >Benutzer erstellen</NavLink
  >
  <NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>
{:else}
  <NavLink to={`/${PATHS.CARD}`}>Zu meiner Karte</NavLink>
{/if}
