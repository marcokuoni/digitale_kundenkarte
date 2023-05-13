<script lang="ts">
  import MoreRightPage from '../../components/layouts/MoreRightPageLayout.svelte'
  import { getIpBlocks, addIpBlock, deleteIpBlock } from '../../codegen'
  import { Wave } from 'svelte-loading-spinners'
  import {
    BUTTON_TYPES,
    DE_CH,
    FETCH_POLICY,
    INPUT_TYPES,
    NAMES,
    PLACEHOLDER_IP,
  } from '../../lib/const'

  let loading = false
  let error = ''
  $: query = getIpBlocks({
    fetchPolicy: FETCH_POLICY.NETWORK_ONLY,
  })

  async function addIpBlockSubmit(event: SubmitEvent) {
    loading = true
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)
      
      const ip = formData.get(NAMES.IP)?.toString()
      const blockedUntil = formData.get(NAMES.BLOCKED_UNTIL)?.toString()
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
    loading = false
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
    <label for={NAMES.IP}>IP</label>
    <input
      type={INPUT_TYPES.TEXT}
      id={NAMES.IP}
      name={NAMES.IP}
      required
      placeholder={PLACEHOLDER_IP}
      value=""
    />
    <label for={NAMES.BLOCKED_UNTIL}>Blockieren bis</label>
    <input
      type={INPUT_TYPES.DATETIME_LOCAL}
      id={NAMES.BLOCKED_UNTIL}
      name={NAMES.BLOCKED_UNTIL}
      required
      value=""
    />
    <button type={BUTTON_TYPES.SUBMIT}>Block IP</button>
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
          <td>{new Date(ipBlock.blockedUntil).toLocaleString(DE_CH)}</td>
          <td>{new Date(ipBlock.createdAt).toLocaleString(DE_CH)}</td>
          <td
            ><button
              type={BUTTON_TYPES.BUTTON}
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
