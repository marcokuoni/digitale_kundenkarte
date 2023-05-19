<script lang="ts">
  import { updateUser, type UpdateUserMutationVariables } from '../../codegen'
  import currentUser from '../../stores/currentUser'
  import SettingsPage from '../../components/layouts/SettingsPageLayout.svelte'
  import PasswordAlert from '../../components/PasswordAlert.svelte'
  import EmailAlert from '../../components/EmailAlert.svelte'
  import {
    BUTTON_TYPES,
    DE_CH,
    INPUT_TYPES,
    KIND,
    NAMES,
    PROCESS_ENV,
    PRODUCTION,
    TRUE,
  } from '../../lib/const'
  import loader from '../../stores/loader'
  import alerts from '../../stores/alerts'

  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION

  async function submitUpdateUser(event: SubmitEvent) {
    loader.setLoader(updateUser.name, true)
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)

      const _id = formData.get(NAMES.ID)?.toString()
      const name = formData.get(NAMES.NAME)?.toString()
      const email = formData.get(NAMES.EMAIL)?.toString()
      const newsletter = formData.get(NAMES.NEWSLETTER)?.toString() === TRUE
      const password = formData.get(NAMES.PASSWORD)?.toString()

      const variables: UpdateUserMutationVariables = {
        _id,
        name,
        email,
        newsletter,
      }

      if (password) {
        variables.password = password
      }

      try {
        const { data } = await updateUser({
          variables,
          optimisticResponse: {
            updateUser: {
              ...$currentUser,
              _id,
              name,
              email,
              newsletter,
              updatedAt: Date.now(),
            },
          },
        })

        if (data && data.updateUser) {
          alerts.addAlert(KIND.POSITIVE, 'Benurzer erfolgreich aktualisiert')
          currentUser.set(data.updateUser)
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
    loader.setLoader(updateUser.name, false)
  }
</script>

<SettingsPage title="Profil">
  {#if !$currentUser}
    <h3>Kein Profil gefunden</h3>
  {:else}
    <h3>Dein Transfercode: {$currentUser && $currentUser.transfercode}</h3>

    <form on:submit|preventDefault={submitUpdateUser}>
      <input
        type={INPUT_TYPES.HIDDEN}
        id={NAMES.ID}
        name={NAMES.ID}
        value={$currentUser && $currentUser._id}
      />

      <div class="form-input-wrapper">
        <label for={NAMES.NAME}>Name</label>
        <input
          type={INPUT_TYPES.TEXT}
          id={NAMES.NAME}
          name={NAMES.NAME}
          value={$currentUser && $currentUser.name}
        />
      </div>

      <div class="form-input-wrapper">
        <EmailAlert />
        <label for={NAMES.EMAIL}>
          E-Mail {$currentUser.emailValidatedAt
            ? `(Validiert am: ${new Date(
                $currentUser.emailValidatedAt
              ).toLocaleString(DE_CH)})`
            : ''}
        </label>
        <input
          type={INPUT_TYPES.EMAIL}
          id={NAMES.EMAIL}
          name={NAMES.EMAIL}
          required={$currentUser?.userRoles &&
            $currentUser.userRoles.length > 0}
          value={$currentUser && $currentUser.email}
        />
      </div>

      <div class="form-input-wrapper form-input-wrapper-checkbox">
        <input
          type={INPUT_TYPES.CHECKBOX}
          id={NAMES.NEWSLETTER}
          name={NAMES.NEWSLETTER}
          value={TRUE}
          checked={$currentUser && $currentUser.newsletter}
        />
        <label for={NAMES.NEWSLETTER}>Newsletter</label>
      </div>

      {#if $currentUser?.userRoles && $currentUser.userRoles.length > 0}
        <PasswordAlert />

        <div class="form-input-wrapper">
          <label for={NAMES.PASSWORD}>
            Passwort {$currentUser.passwordChangedAt
              ? `(letzte Änderung am: ${new Date(
                  $currentUser.passwordChangedAt
                ).toLocaleString(DE_CH)})`
              : ''}
          </label>
          <input
            type={INPUT_TYPES.PASSWORD}
            id={NAMES.PASSWORD}
            name={NAMES.PASSWORD}
            value={''}
          />
        </div>
      {/if}

      <button
        class="default-button form-submit-button"
        type={BUTTON_TYPES.SUBMIT}>Profil aktualisieren</button
      >
    </form>
  {/if}
</SettingsPage>

<style>
  form {
    display: flex;
    flex-direction: column;
  }

  .form-input-wrapper {
    display: flex;
    flex-direction: column;
    margin: 8px 0;
  }

  .form-input-wrapper-checkbox {
    flex-direction: row;
  }

  .form-input-wrapper-checkbox > input {
    margin-right: 8px;
  }

  .form-submit-button {
    margin-bottom: 0;
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
</style>
