<script>
  import { signIn } from '../codegen'
  import { navigate } from 'svelte-routing'

  let transferCode = ''
  let password = ''

  async function loginUser() {
    const { data } = await signIn({
      variables: {
        transferCode,
        password,
      },
    })
    if (data && data.signIn) {
      navigate('/card')
    } else {
      alert('Error')
    }
  }
</script>

<h1>Login User</h1>
<form on:submit|preventDefault={loginUser}>
  <label for="transferCode">Transfer Code</label>
  <input type="text" id="transferCode" bind:value={transferCode} />
  <!-- TODO: Password should only be visible if requested -->
  <label for="password">Password</label>
  <input type="password" id="password" bind:value={password} />
  <button type="submit">Login User</button>
</form>
