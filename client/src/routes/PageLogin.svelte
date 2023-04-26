<script>
  import { signIn } from '../codegen'
  import { PATHS } from '../lib/const'
  import { navigate } from 'svelte-routing'

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

<h1>Login User</h1>
<form on:submit|preventDefault={loginUser}>
  <label for="transfercode">Transfer Code</label>
  <input type="text" id="transfercode" bind:value={transfercode} />
  <!-- TODO: Password should only be visible if requested -->
  <label for="password">Password</label>
  <input type="password" id="password" bind:value={password} />
  <button type="submit">Login User</button>
</form>
