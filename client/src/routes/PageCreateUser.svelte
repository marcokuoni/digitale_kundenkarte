<script lang="ts">
  import { signUp } from '../codegen'
  import { PATHS } from '../lib/const'
  import NavLink from '../components/NavLink.svelte'

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

<h1>Create User</h1>
<form on:submit|preventDefault={createUser}>
  <label for="name">Name</label>
  <input type="text" id="name" bind:value={name} />
  <label for="email">Email</label>
  <input type="email" id="email" bind:value={email} />
  <label for="newsletter"
    ><input
      type="checkbox"
      id="newsletter"
      value="true"
      bind:checked={newsletter}
    /> Wants Newsletter</label
  >
  <!-- TODO: Password should only be visible if requested if visible also required -->
  <label for="password">Password</label>
  <input type="password" id="password" bind:value={password} />
  <button type="submit">Create User</button>
</form>
<NavLink to={PATHS.LOGIN_USER}>Ich besitze bereits eine Karte</NavLink>