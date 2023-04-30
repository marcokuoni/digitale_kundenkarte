<script lang="ts">
  import { PATHS } from '../lib/const'
  import { onMount } from 'svelte'
  import { addStamp } from '../codegen'

  export let urlToken: string = '';
  onMount(async () => {
    const { data } = await addStamp({
      variables: {
        urlToken
      },
    })

    if (data && data.addStamp) {
      console.log('stamp added')
    } else {
      console.error('Error')
    }
    _navigateToCardWithoutHistory()
  })

  const _navigateToCardWithoutHistory = () => {
    window.history.replaceState({}, document.title, `/${PATHS.CARD}`)
    // dont use navigate(PATHS.CARD) because it will not cause a reload
    window.location.href = `/${PATHS.CARD}`
  }
</script>

<h1>Stamp Page</h1>
<p>
  This page is never shown to the user and is just used to set the session
  cookie for the stamp
</p>
