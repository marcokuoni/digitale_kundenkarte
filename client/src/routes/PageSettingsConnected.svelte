<script lang="ts">
  import { getActiveRefreshTokens, revokeRefreshToken } from '../codegen'
  import { Wave } from 'svelte-loading-spinners'

  let loading = false
  let error = ''
  $: query = getActiveRefreshTokens({
    fetchPolicy: 'network-only',
    //needed cause fast changing properties here :)
    pollInterval: 100,
  })

  const revokeClickHandler = async (e: MouseEvent) => {
    const button = e.currentTarget as HTMLButtonElement
    loading = true
    try {
      await revokeRefreshToken({
        variables: {
          _id: button.dataset._id,
        },
      })
      await $query.query.refetch()
    } catch (err) {
      error = err.message
    } finally {
      loading = false
    }
  }
</script>

<main>
  <h1>Verbundene Geräte</h1>
  {#if loading}
    <Wave size="100" color="#FF3E00" unit="px" />
  {/if}
  {#if $query.error || error}
    <span>{$query.error.message || error}</span>
  {/if}
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Gültig bis</th>
        <th>Ausgestellt am</th>
        <th colspan="2">Erstellt von</th>
        <th>Funktionen</th>
      </tr>
      <tr>
        <th colspan="3"></th>
        <th>IP</th>
        <th>Agent</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each $query.data?.getActiveRefreshTokens || [] as refreshToken}
        <tr>
          <td>{refreshToken._id}</td>
          <td>{new Date(refreshToken.expires).toLocaleString('de-CH')}</td>
          <td>{new Date(refreshToken.created).toLocaleString('de-CH')}</td>
          <td>{refreshToken.createdByIp}</td>
          <td>{refreshToken.createdByUserAgent}</td>
          <td
            ><button
              type="button"
              on:click={revokeClickHandler}
              data-_id={refreshToken._id}>Abmelden</button
            ></td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
</style>
