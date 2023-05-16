<script lang="ts">
  import { onMount } from 'svelte'
  import { honourCardFrom } from '../../codegen'
  import MoreRightsPage from '../../components/layouts/MoreRightsPageLayout.svelte'
  import { BUTTON_TYPES, INPUT_TYPES, NAMES } from '../../lib/const'
  import { Wave } from 'svelte-loading-spinners'

  export let transfercode: string = ''

  let successfully: boolean | null = null
  let loading = false

  const honourCard = async (event: SubmitEvent) => {
    loading = true
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)

      const transfercode = formData.get(NAMES.TRANSFERCODE)?.toString()
      await _honourCard(transfercode)
    }
    loading = false
  }
  onMount(async () => {
    if (transfercode !== '') {
      loading = true
      await _honourCard(transfercode)
      loading = false
    }
  })

  const _honourCard = async (transfercode: string) => {
    const { data } = await honourCardFrom({
      variables: {
        transfercode,
      },
    })

    successfully = false

    if (data) {
      successfully = !!data.honourCardFrom
    } else {
      console.error('Error')
    }
  }
</script>

<MoreRightsPage title="Karte Einlösen">
  {#if loading}
    <Wave size="100" color="#FF3E00" unit="px" />
  {/if}
  <form on:submit|preventDefault={honourCard}>
    <label for={NAMES.TRANSFERCODE}>Transfer Code</label>
    <input
      type={INPUT_TYPES.TEXT}
      id={NAMES.TRANSFERCODE}
      value={transfercode}
    />
    <button type={BUTTON_TYPES.BUTTON}>Einlösen</button>
  </form>
  <p>
    {#if successfully === true}
      <span>Eine Karte wurde erfolgreich eingelöst</span>
    {:else if successfully === false}
      <span>Keine Karte konnte eingelöst werden</span>
    {/if}
  </p>
</MoreRightsPage>
