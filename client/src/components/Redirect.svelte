<script lang="ts">
  import { navigate } from 'svelte-routing'

  export const to: string = '/'
  navigate(to, { replace: true })
</script>
