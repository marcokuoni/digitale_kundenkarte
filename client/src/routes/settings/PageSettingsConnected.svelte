<script lang="ts">
  import { getActiveRefreshTokens } from '../../codegen'
  import SettingsPage from '../../components/layouts/SettingsPageLayout.svelte'
  import { FETCH_POLICY, KIND, PROCESS_ENV, PRODUCTION } from '../../lib/const'
  import SettingsConnectedDevice from '../../components/SettingsConnectedDevice.svelte'
  import loader from '../../stores/loader'
  import alerts from '../../stores/alerts'

  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION
  const query = getActiveRefreshTokens({
    fetchPolicy: FETCH_POLICY.NETWORK_ONLY,
    //needed cause fast changing properties here :) if refresh token gets exchanged in meantime the _id will already been outdated.
    pollInterval: 100,
  })

  query.subscribe((result) => {
    if (result.loading) {
      loader.setLoader(getActiveRefreshTokens.name, true)
    } else {
      loader.setLoader(getActiveRefreshTokens.name, false)
    }
    if (result.error) {
      alerts.addAlert(
        KIND.WARNING,
        'Etwas ist schief gelaufen. Bitte versuche es erneut'
      )
      !production && console.error(result.error)
    }
  })
</script>

<SettingsPage title="Verbundene Geräte">
  <div class="devices-wrapper">
    {#each $query.data?.getActiveRefreshTokens || [] as refreshToken}
      <SettingsConnectedDevice device={refreshToken} />
    {/each}
  </div>
</SettingsPage>

<style>
</style>
