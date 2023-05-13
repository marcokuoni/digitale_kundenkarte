<script lang="ts">
  import client from '../services/apollo/client'
  import { purge } from '../services/apollo/persistor'
  import { signOut } from '../codegen'
  import { navigate } from 'svelte-routing'
  import { PATHS, PROCESS_ENV } from '../lib/const'
  import currentUser from '../stores/currentUser'
  import { onDestroy } from 'svelte'

  let hasMoreRights = false

  async function logout() {
    const { data } = await signOut({})
    if (data && data.signOut) {
      localStorage.removeItem(PROCESS_ENV.JWT_COOKIE_NAME)
      await purge()
      client.resetStore()
      currentUser.reset()

      if(hasMoreRights) {
      navigate(`/${PATHS.LOGIN_USER}/${PATHS.WITH_PASSWORD}`)
      } else {
      navigate(`/${PATHS.LOGIN_USER}`)
      }
    } else {
      alert('Error')
    }
  }


  const unsubscribe = currentUser.subscribe((currentUser) => {
    if (
      currentUser &&
      currentUser.userRoles &&
      currentUser.userRoles.length > 0
    ) {
      hasMoreRights = true
    }
  })

  onDestroy(unsubscribe)
</script>

<button type="button" on:click={logout}>Abmelden</button>
