<script lang="ts">
  import client from '../lib/apollo/client'
  import { purge } from '../lib/apollo/persistor'
  import { signOut } from '../codegen'
  import { navigate } from 'svelte-routing'
  import { PATHS } from '../lib/const'
  import currentUser from '../stores/currentUser'

  async function logout() {
    const { data } = await signOut({})
    if (data && data.signOut) {
      localStorage.removeItem('process.env.JWT_COOKIE_NAME')
      await purge()
      client.resetStore()
      currentUser.reset()

      navigate(`/${PATHS.LOGIN_USER}`)
    } else {
      alert('Error')
    }
  }
</script>

<button type="button" on:click={logout}>Abmelden</button>
