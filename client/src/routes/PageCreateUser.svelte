<script lang="ts">
  import { signUp } from '../codegen'
  import { PATHS } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'
  import currentUser from '../stores/currentUser'
  import Logout from '../components/Logout.svelte'

  export let withPassword: string = ''

  let name = ''
  let email = ''
  let password = ''
  let newsletter = false

  async function createUser(event: SubmitEvent) {
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const { data } = await signUp({
        variables: {
          name,
          email,
          newsletter,
          password,
          successRedirect: `/${PATHS.CARD}`,
        },
      })
      if (data && data.signUp) {
        console.error(
          'This should not happen otherwise the browser will cache the input data'
        )
      } else {
        alert('Error')
      }
    }
  }
</script>

<h1>Benutzer erstellen</h1>
<form on:submit|preventDefault={createUser}>
  <label for="name">Name</label>
  <input type="text" id="name" bind:value={name} />
  <label for="email">E-Mail</label>
  <input type="email" required={withPassword !== ''} id="email" bind:value={email} />
  <label for="newsletter"
    ><input
      type="checkbox"
      id="newsletter"
      value="true"
      bind:checked={newsletter}
    /> Will Newsletter</label
  >
  {#if withPassword !== ''}
    <label for="password">Passwort</label>
    <input type="password" id="password" required bind:value={password} />
  {/if}
  <button type="submit">Benutzer erstellen</button>
</form>

{#if withPassword !== ''}
  <NavLink to={`${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`}>Anmelden</NavLink>
  {#if $currentUser}
    <Logout />
    <NavLink to={`/${PATHS.HOME}`}>Startseite</NavLink>
  {/if}
{:else}
  {#if $currentUser}
    <Logout />
  {:else}
    <NavLink to={PATHS.LOGIN_USER}>Ich besitze bereits eine Karte</NavLink>
  {/if}
  <NavLink to={PATHS.CARD}>Zu meiner Karte</NavLink>
{/if}
