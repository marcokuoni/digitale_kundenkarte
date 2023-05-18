<script lang="ts">
  import { getActiveRefreshTokens, revokeRefreshToken } from '../../codegen'
  import SettingsPage from '../../components/layouts/SettingsPageLayout.svelte'
  import { FETCH_POLICY } from '../../lib/const'
  import SettingsConnectedDevice from '../../components/SettingsConnectedDevice.svelte'
  import loader from '../../stores/loader'

  let error = ''
  const query = getActiveRefreshTokens({
    fetchPolicy: FETCH_POLICY.NETWORK_ONLY,
    //needed cause fast changing properties here :) if refresh token gets exchanged in meantime the _id will already been outdated.
    pollInterval: 100,
  })

  query.subscribe(data => {
    if(data.error) {
      console.error(data.error)
    }
    if(data.loading) {
      loader.setLoader(getActiveRefreshTokens.name, true)
    } else {
      loader.setLoader(getActiveRefreshTokens.name, false)
    }
  })

</script>

<SettingsPage title="Verbundene Geräte">
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
