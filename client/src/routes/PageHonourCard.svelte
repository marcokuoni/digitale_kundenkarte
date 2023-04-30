<script lang="ts">
  import { onMount } from 'svelte'
  import { honourCardFrom } from '../codegen'

  export let transfercode: string = ''
  let successfully: boolean | null = null

  const honourCard = async () => {
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
  onMount(async () => {
    if(transfercode !== '') {
      await honourCard()
    }
  })
</script>

<h1>Karte Einlösen</h1>
<form on:submit|preventDefault={honourCard}>
    <label for="transfercode">Transfer Code</label>
    <input type="text" id="transfercode" bind:value={transfercode} />
    <button type="submit">Einlösen</button>
</form>
<p>
  {#if successfully === true}
    <span>Eine Karte wurde erfolgreich eingelöst</span>
  {:else if successfully === false}
    <span>Keine Karte konnte eingelöst werden</span>
  {/if}
</p>
