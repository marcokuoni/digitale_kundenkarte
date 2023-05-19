<script lang="ts">
  import {
    DE_CH,
    FETCH_POLICY,
    KIND,
    PROCESS_ENV,
    PRODUCTION,
  } from '../lib/const.js'
  import { getActiveRefreshTokens, revokeRefreshToken } from '../codegen.js'
  import loader from '../stores/loader'
  import alerts from '../stores/alerts.js'

  export let device
  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION

  $: query = getActiveRefreshTokens({
    fetchPolicy: FETCH_POLICY.NETWORK_ONLY,
    //needed cause fast changing properties here :) if refresh token gets exchanged in meantime the _id will already been outdated.
    pollInterval: 100,
  })

  const revokeClickHandler = async (e: MouseEvent) => {
    loader.setLoader(revokeRefreshToken.name, true)
    const button = e.currentTarget as HTMLButtonElement
    try {
      const { data } = await revokeRefreshToken({
        variables: {
          _id: button.dataset._id,
        },
      })

      if (data && data.revokeRefreshToken) {
        alerts.addAlert(KIND.POSITIVE, 'Das Gerät wurde erfolgreich abgemeldet')
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
    loader.setLoader(revokeRefreshToken.name, false)
  }
</script>

<main class="device-wrapper">
  <div class="device-info-wrapper">
    <p class="device-info-label">ID:</p>
    <p>{device._id}</p>
  </div>

  <div class="device-info-wrapper">
    <p class="device-info-label">Gültig bis:</p>
    <p>{new Date(device.expires).toLocaleString(DE_CH)}</p>
  </div>

  <div class="device-info-wrapper">
    <p class="device-info-label">Ausgestellt am:</p>
    <p>{new Date(device.created).toLocaleString(DE_CH)}</p>
  </div>

  <div class="device-info-wrapper">
    <p class="device-info-label">Erstellt von:</p>
    <p>{device.createdByIp}</p>
    <p>{device.createdByUserAgent}</p>
  </div>

  <button
    class="default-button"
    on:click={revokeClickHandler}
    data-_id={device._id}
  >
    Abmelden
  </button>
</main>

<style>
  .device-wrapper {
    margin: 8px 0;
    padding: 12px;
    border: solid 1px var(--background-raised-color);
    border-radius: 8px;
  }

  .device-info-label {
    font-weight: bold;
    margin-top: 4px;
  }
</style>
