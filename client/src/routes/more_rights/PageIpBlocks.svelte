<script lang="ts">
  import MoreRightPage from '../../components/MoreRightPage.svelte'
  import { getIpBlocks, addIpBlock, deleteIpBlock } from '../../codegen'
  import { Wave } from 'svelte-loading-spinners'

  let ip = ''
  let blockedUntil = ''
  let loading = false
  let error = ''
  $: query = getIpBlocks({
    fetchPolicy: 'network-only',
  })

  async function addIpBlockSubmit() {
    const { data } = await addIpBlock({
      variables: {
        ip,
        blockedUntil,
      },
    })
    if (data && data.addIpBlock) {
      await $query.query.refetch()
      alert('Success')
    } else {
      alert('Error')
    }
  }

  const deleteClickHandler = async (e: MouseEvent) => {
    const button = e.currentTarget as HTMLButtonElement
    loading = true
    try {
      await deleteIpBlock({
        variables: {
          _id: button.dataset._id,
        },
      })
      await $query.query.refetch()
      alert('Success')
    } catch (err) {
      error = err.message
    } finally {
      loading = false
    }
  }
</script>

<MoreRightPage title="Geblockte IPs">
  <form on:submit|preventDefault={addIpBlockSubmit}>
    <label for="ip">IP</label>
    <input
      type="text"
      id="ip"
      bind:value={ip}
      placeholder="::ffff:172.18.0.5"
    />
    <label for="blockedUntil">Blockieren bis</label>
    <input type="datetime-local" id="blockedUntil" bind:value={blockedUntil} />
    <button type="submit" disabled={ip === '' || blockedUntil === ''}
      >Block IP</button
    >
  </form>
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
        <th>IP</th>
        <th>Geblockt bis</th>
        <th>Erstellt am</th>
        <th>Funktionen</th>
      </tr>
    </thead>
    <tbody>
      {#each $query.data?.getIpBlocks || [] as ipBlock}
        <tr>
          <td>{ipBlock._id}</td>
          <td>{ipBlock.ip}</td>
          <td>{new Date(ipBlock.blockedUntil).toLocaleString('de-CH')}</td>
          <td>{new Date(ipBlock.createdAt).toLocaleString('de-CH')}</td>
          <td
            ><button
              type="button"
              on:click={deleteClickHandler}
              data-_id={ipBlock._id}>Löschen</button
            ></td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</MoreRightPage>

<style>
</style>
