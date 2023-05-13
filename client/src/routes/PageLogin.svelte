<script lang="ts">
  import { signIn } from '../codegen'
  import { PATHS } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'

  export let withPassword: string = ''

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
      console.error(e)
    }
  }
</script>

<h1>Anmelden</h1>
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
  <NavLink to={`${PATHS.CREATE_USER}/${PATHS.WITH_PASSWORD}`}
    >Benutzer erstellen</NavLink
  >
  <NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>
{:else}
  <NavLink to={PATHS.CREATE_USER}>Ich möchte eine Karte erstellen</NavLink>
  <NavLink to={PATHS.CARD}>Zu meiner Karte</NavLink>
{/if}
