<script lang="ts">
  import MoreRightsPage from '../../components/layouts/MoreRightsPageLayout.svelte'
  import { getIpBlocks, addIpBlock, deleteIpBlock } from '../../codegen'
  import {
    BUTTON_TYPES,
    DE_CH,
    FETCH_POLICY,
    INPUT_TYPES,
    KIND,
    NAMES,
    PLACEHOLDER_IP,
    PROCESS_ENV,
    PRODUCTION,
  } from '../../lib/const'
  import loader from '../../stores/loader'
  import alerts from '../../stores/alerts'

  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION
  const query = getIpBlocks({
    fetchPolicy: FETCH_POLICY.NETWORK_ONLY,
  })

  query.subscribe((result) => {
    if (result.loading) {
      loader.setLoader(getIpBlocks.name, true)
    } else {
      loader.setLoader(getIpBlocks.name, false)
    }
    if (result.error) {
      alerts.addAlert(
        KIND.WARNING,
        'Etwas ist schief gelaufen. Bitte versuche es erneut'
      )
      !production && console.error(result.error)
    }
  })

  async function addIpBlockSubmit(event: SubmitEvent) {
    loader.setLoader(addIpBlock.name, true)
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)

      const ip = formData.get(NAMES.IP)?.toString()
      const blockedUntil = formData.get(NAMES.BLOCKED_UNTIL)?.toString()
      try {
        const { data } = await addIpBlock({
          variables: {
            ip,
            blockedUntil,
          },
        })
        if (data && data.addIpBlock) {
          alerts.addAlert(KIND.POSITIVE, 'IP wurde erfolgreich blockiert')
          await $query.query.refetch()
        } else {
          alerts.addAlert(
            KIND.WARNING,
            'Etwas ist schief gelaufen. Bitte versuche es erneut'
          )
        }
      } catch (e) {
        alerts.addAlert(
          KIND.WARNING,
          'Etwas ist schief gelaufen. Bitte versuche es erneut'
        )
        !production && console.error(e)
      }
    }
    loader.setLoader(addIpBlock.name, false)
  }

  const deleteClickHandler = async (e: MouseEvent) => {
    loader.setLoader(deleteIpBlock.name, true)
    const button = e.currentTarget as HTMLButtonElement
    try {
      const { data } = await deleteIpBlock({
        variables: {
          _id: button.dataset._id,
        },
      })

      if (data && data.deleteIpBlock) {
        alerts.addAlert(
          KIND.POSITIVE,
          'IP wurde erfolgreich wieder freigegeben'
        )
        await $query.query.refetch()
      } else {
        alerts.addAlert(
          KIND.WARNING,
          'Etwas ist schief gelaufen. Bitte versuche es erneut'
        )
      }
    } catch (e) {
      alerts.addAlert(
        KIND.WARNING,
        'Etwas ist schief gelaufen. Bitte versuche es erneut'
      )
      !production && console.error(e)
    }

    loader.setLoader(deleteIpBlock.name, false)
  }
</script>

<MoreRightsPage title="IPs Blockieren">
  <form on:submit|preventDefault={addIpBlockSubmit}>
    <div class="form-input-wrapper">
      <label for={NAMES.IP}>IP Adresse</label>
      <input
        type={INPUT_TYPES.TEXT}
        id={NAMES.IP}
        name={NAMES.IP}
        required
        placeholder={PLACEHOLDER_IP}
        value=""
      />
    </div>

    <div class="form-input-wrapper">
      <label for={NAMES.BLOCKED_UNTIL}>Blockieren bis</label>
      <input
        type={INPUT_TYPES.DATETIME_LOCAL}
        id={NAMES.BLOCKED_UNTIL}
        name={NAMES.BLOCKED_UNTIL}
        required
        value=""
      />
    </div>

    <button class="default-button" type={BUTTON_TYPES.SUBMIT}>Block IP</button>
  </form>

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

        <button
          class="default-button"
          type={BUTTON_TYPES.BUTTON}
          on:click={deleteClickHandler}
          data-_id={ipBlock._id}
        >
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
