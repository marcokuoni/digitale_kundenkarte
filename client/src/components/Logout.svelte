<script lang="ts">
  import Cookies from 'js-cookie'
  import client from '../lib/apollo/client'
  import { purge } from '../lib/apollo/persistor'
  import { signOut } from '../codegen'
  import { navigate } from 'svelte-routing'
  import { PATHS } from '../lib/const'

  async function logout() {
    const { data } = await signOut({})
    if (data && data.signOut) {
      Cookies.remove('process.env.JWT_COOKIE_NAME')
      await purge()
      client.resetStore()

      navigate(`/${PATHS.LOGIN_USER}`)
    } else {
      alert('Error')
    }
  }
</script>

<button type="button" on:click={logout}>Logout</button>
