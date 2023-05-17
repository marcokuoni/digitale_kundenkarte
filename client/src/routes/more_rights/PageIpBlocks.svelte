<script lang="ts">
  import MoreRightsPage from '../../components/layouts/MoreRightsPageLayout.svelte'
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

<MoreRightsPage title="IPs Blockieren">
  <form on:submit|preventDefault={addIpBlockSubmit}>

    <div class="form-input-wrapper">
      <label for={NAMES.IP}>IP Adresse</label>
      <input type={INPUT_TYPES.TEXT}
             id={NAMES.IP}
             name={NAMES.IP}
             required
             placeholder={PLACEHOLDER_IP}
             value=""/>
    </div>

    <div class="form-input-wrapper">
      <label for={NAMES.BLOCKED_UNTIL}>Blockieren bis</label>
      <input type={INPUT_TYPES.DATETIME_LOCAL}
             id={NAMES.BLOCKED_UNTIL}
             name={NAMES.BLOCKED_UNTIL}
             required
             value=""/>
    </div>

    <button class="default-button" type={BUTTON_TYPES.SUBMIT}>Block IP</button>

  </form>

  {#if loading} <Wave size="100" color="#FF3E00" unit="px" />{/if}

  {#if $query.error || error}
    <span>{$query.error.message || error}</span>
  {/if}

  <h3>Geblockte IPs</h3>

  <div class="blocked-list">

    {#each $query.data?.getIpBlocks || [] as ipBlock}
      <div class="ip-block">

        <div class="ip-block-group">
          <p>ID:</p>
          <p>{ipBlock._id}</p>
        </div>

        <div class="ip-block-group">
          <p>IP Address:</p>
          <p>{ipBlock.ip}</p>
        </div>

        <div class="ip-block-group">
          <p>Blocked until:</p>
          <p>{new Date(ipBlock.blockedUntil).toLocaleString(DE_CH)}</p>
        </div>

        <div class="ip-block-group">
          <p>Created at:</p>
          <p>{new Date(ipBlock.createdAt).toLocaleString(DE_CH)}</p>
        </div>

        <button class="default-button"
                type="{BUTTON_TYPES.BUTTON}"
                on:click={deleteClickHandler}
                data-_id="{ipBlock._id}">
          Löschen
        </button>

      </div>

    {/each}

  </div>

</MoreRightsPage>


<style>

  h3 {
    margin-top: 12px;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  .form-input-wrapper {
    display: flex;
    flex-direction: column;
    margin: 8px 0;
  }

  label {
    font-size: 11pt;
    font-weight: bold;
  }

  input {
    color: var(--foreground-color);
    background-color: var(--background-raised-color);

    padding: 8px 12px;

    border: none;
    border-radius: 8px;
  }

  .ip-block {
    border: 1px solid var(--background-raised-color);
    border-radius: 8px;
    padding: 12px;
  }

  .ip-block-group {
    margin: 8px 0;
  }

  .ip-block-group p:nth-child(1) {
    opacity: 0.5;
  }

</style>