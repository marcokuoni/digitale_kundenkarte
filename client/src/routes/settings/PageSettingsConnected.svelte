<script lang="ts">
  import { getActiveRefreshTokens, revokeRefreshToken } from '../../codegen'
  import { Wave } from 'svelte-loading-spinners'
  import SettingsPage from '../../components/layouts/SettingsPageLayout.svelte'
  import { FETCH_POLICY } from '../../lib/const'
  import SettingsConnectedDevice from '../../components/SettingsConnectedDevice.svelte'

  let loading = false
  let error = ''
  $: query = getActiveRefreshTokens({
    fetchPolicy: FETCH_POLICY.NETWORK_ONLY,
    //needed cause fast changing properties here :) if refresh token gets exchanged in meantime the _id will already been outdated.
    pollInterval: 100,
  })

</script>

<SettingsPage title="Verbundene Geräte">

  {#if loading}
    <Wave size="100" color="#FF3E00" unit="px" />
  {/if}

  {#if $query.error || error}
    <span>{$query.error.message || error}</span>
  {/if}

  <div class="devices-wrapper">

    {#each $query.data?.getActiveRefreshTokens || [] as refreshToken}
      <SettingsConnectedDevice device="{refreshToken}" />
    {/each}

  </div>

</SettingsPage>

<style>
</style>
