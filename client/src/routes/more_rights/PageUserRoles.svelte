<script lang="ts">
  import MoreRightsPage from '../../components/layouts/MoreRightsPageLayout.svelte'
  import { getUsersWithPassword, updateUserRoles } from '../../codegen'
  import {
    BUTTON_TYPES,
    FETCH_POLICY,
    INPUT_TYPES,
    KIND,
    NAMES,
    PROCESS_ENV,
    PRODUCTION,
    USER_ROLES,
  } from '../../lib/const'
  import loader from '../../stores/loader'
  import alerts from '../../stores/alerts'
  import { onDestroy } from 'svelte'

  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION
  const query = getUsersWithPassword({
    fetchPolicy: FETCH_POLICY.NETWORK_ONLY,
  })

  const unsubscribe = query.subscribe((result) => {
    if (result.loading) {
      loader.setLoader(getUsersWithPassword.name, true)
    } else {
      loader.setLoader(getUsersWithPassword.name, false)
    }
    if (result.error) {
      alerts.addAlert(
        KIND.WARNING,
        'Etwas ist schief gelaufen. Bitte versuche es erneut'
      )
      !production && console.error(result.error)
    }
  })

  async function submitUpdateUser(event: SubmitEvent) {
    loader.setLoader(updateUserRoles.name, true)
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)

      const _id = formData.get(NAMES.ID)?.toString()
      const userRoles = formData.getAll(NAMES.USER_ROLES) as USER_ROLES[]

      try {
        const { data } = await updateUserRoles({
          variables: {
            _id,
            userRoles,
          },
        })

        if (data && data.updateUserRoles) {
          alerts.addAlert(
            KIND.POSITIVE,
            'Benuzter Gruppen wurden erfolgreich aktualisiert'
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
    }
    loader.setLoader(updateUserRoles.name, false)
  }

  onDestroy(unsubscribe)
</script>

<MoreRightsPage title="Benutzer Gruppen verwalten">
  <div class="user-groups-list">
    {#each $query.data?.getUsersWithPassword || [] as user}
      <div class="user-group-wrapper">
        <div class="user-info-wrapper">
          <p>
            <span class="user-info-label">ID:</span><br />
            {user._id}
          </p>
        </div>

        <div class="user-info-wrapper">
          <p>
            <span class="user-info-label">E-Mailadresse:</span><br />
            {user.email || '–'}
          </p>
        </div>

        <div class="user-info-wrapper">
          <p>
            <span class="user-info-label">Name:</span><br />
            {user.name || '–'}
          </p>
        </div>

        <div class="user-group-item">
          <form on:submit|preventDefault={submitUpdateUser}>
            <input
              type={INPUT_TYPES.HIDDEN}
              id={NAMES.ID}
              name={NAMES.ID}
              value={user._id}
            />

            <label>
              <input
                type={INPUT_TYPES.CHECKBOX}
                id={USER_ROLES.ADMIN}
                name={NAMES.USER_ROLES}
                value={USER_ROLES.ADMIN}
                checked={user.userRoles.includes(USER_ROLES.ADMIN)}
              />
              Administrator
            </label>

            <label>
              <input
                type={INPUT_TYPES.CHECKBOX}
                id={USER_ROLES.EMPLOYEE}
                name={NAMES.USER_ROLES}
                value={USER_ROLES.EMPLOYEE}
                checked={user.userRoles.includes(USER_ROLES.EMPLOYEE)}
              />
              Mitarbeiter
            </label>

            <button class="default-button" type={BUTTON_TYPES.SUBMIT}
              >Benutzer aktualisieren</button
            >
          </form>
        </div>
      </div>
    {/each}
  </div>
</MoreRightsPage>

<style>
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

  .user-group-wrapper {
    margin: 8px 0;
    padding: 12px;
    border: solid 1px var(--background-raised-color);
    border-radius: 8px;
  }

  .user-info-label {
    font-weight: bold;
  }
</style>
