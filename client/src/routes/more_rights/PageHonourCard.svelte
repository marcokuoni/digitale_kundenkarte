<script lang="ts">
  import { onMount } from 'svelte'
  import { honourCardFrom } from '../../codegen'
  import MoreRightsPage from '../../components/layouts/MoreRightsPageLayout.svelte'
  import {
    BUTTON_TYPES,
    INPUT_TYPES,
    KIND,
    NAMES,
    PROCESS_ENV,
    PRODUCTION,
  } from '../../lib/const'
  import Separator from '../../components/Separator.svelte'
  import loader from '../../stores/loader'
  import alerts from '../../stores/alerts'

  export let transfercode: string = ''

  let successfully: boolean | null = null
  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION

  const honourCard = async (event: SubmitEvent) => {
    loader.setLoader(honourCardFrom.name, true)
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)

      const transfercode = formData.get(NAMES.TRANSFERCODE)?.toString()
      await _honourCard(transfercode)
    }
    loader.setLoader(honourCardFrom.name, false)
  }
  onMount(async () => {
    loader.setLoader(honourCardFrom.name, true)
    if (transfercode !== '') {
      await _honourCard(transfercode)
    }
    loader.setLoader(honourCardFrom.name, false)
  })

  const _honourCard = async (transfercode: string) => {
    try {
      const { data } = await honourCardFrom({
        variables: {
          transfercode,
        },
      })

      successfully = false

      if (data) {
        successfully = !!data.honourCardFrom
        if (successfully) {
          alerts.addAlert(
            KIND.POSITIVE,
            'Eine Karte wurde erfolgreich eingelöst'
          )
        } else {
          alerts.addAlert(KIND.NEGATIVE, 'Keine Karte konnte eingelöst werden')
        }
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
</script>

<MoreRightsPage title="Karte Einlösen">
  <p>
    {#if successfully === true}
      <h3 class="positive">Eine Karte wurde erfolgreich eingelöst</h3>
    {:else if successfully === false}
      <h3 class="negative">Keine Karte konnte eingelöst werden</h3>
    {/if}
  </p>
  <form on:submit|preventDefault={honourCard}>
    <label for={NAMES.TRANSFERCODE}>Transfer Code</label>
    <input
      required
      type={INPUT_TYPES.TEXT}
      id={NAMES.TRANSFERCODE}
      name={NAMES.TRANSFERCODE}
      value={transfercode}
    />

    <button class="default-button" type={BUTTON_TYPES.SUBMIT}>Einlösen</button>
  </form>

  <Separator>oder</Separator>
</MoreRightsPage>

<style>
  h3.positive {
    color: var(--positive-color);
  }

  h3.negative {
    color: var(--negative-color);
  }

  form {
    display: flex;
    flex-direction: column;
  }

  label {
    font-size: 1rem;
    font-weight: bold;
  }

  input {
    color: var(--foreground-color);
    background-color: var(--background-raised-color);

    padding: 8px 12px;

    border: none;
    border-radius: 8px;
  }
</style>
