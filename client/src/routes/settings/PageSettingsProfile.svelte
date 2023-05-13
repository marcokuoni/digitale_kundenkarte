<script lang="ts">
  import { updateUser, type UpdateUserMutationVariables } from '../../codegen'
  import currentUser from '../../stores/currentUser'
  import SettingsPage from '../../components/layouts/SettingsPageLayout.svelte'
  import { Wave } from 'svelte-loading-spinners'
  import PasswordAlert from '../../components/PasswordAlert.svelte'
  import EmailAlert from '../../components/EmailAlert.svelte'
  import { BUTTON_TYPES, DE_CH, INPUT_TYPES, NAMES, TRUE } from '../../lib/const'

  let loading = false

  async function submitUpdateUser(event: SubmitEvent) {
    loading = true
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
        currentUser.set(data.updateUser)
        console.log('User updated')
      } else {
        console.error('Error')
      }
    }
    loading = false
  }
</script>

<SettingsPage title="Profil">
  {#if loading}
    <Wave size="100" color="#FF3E00" unit="px" />
  {/if}
  {#if !$currentUser}
    <h2>Kein Profil gefunden</h2>
  {:else}
    <h2>Dein Transfercode: {$currentUser && $currentUser.transfercode}</h2>
    <form on:submit|preventDefault={submitUpdateUser}>
      <input
        type={INPUT_TYPES.HIDDEN}
        id={NAMES.ID}
        name={NAMES.ID}
        value={$currentUser && $currentUser._id}
      />
      <label for={NAMES.NAME}>Name</label>
      <input
        type={INPUT_TYPES.TEXT}
        id={NAMES.NAME}
        name={NAMES.NAME}
        value={$currentUser && $currentUser.name}
      />

      <EmailAlert />
      <label for={NAMES.EMAIL}>E-Mail{$currentUser.emailValidatedAt && (` (Validiert am: ${new Date(
        $currentUser.emailValidatedAt
      ).toLocaleString(DE_CH)})`)}</label>
      <input
        type={INPUT_TYPES.EMAIL}
        id={NAMES.EMAIL}
        name={NAMES.EMAIL}
        required={$currentUser?.userRoles && $currentUser.userRoles.length > 0}
        value={$currentUser && $currentUser.email}
      />
      <label for={NAMES.NEWSLETTER}
        ><input
          type={INPUT_TYPES.CHECKBOX}
          id={NAMES.NEWSLETTER}
          name={NAMES.NEWSLETTER}
          value={TRUE}
          checked={$currentUser && $currentUser.newsletter}
        /> Will Newsletter</label
      >
      {#if $currentUser?.userRoles && $currentUser.userRoles.length > 0}
        <PasswordAlert />
        <label for={NAMES.PASSWORD}
          >Passwort (letzte Änderung am: {new Date(
            $currentUser.passwordChangedAt
          ).toLocaleString(DE_CH)})</label
        >
        <input type={INPUT_TYPES.PASSWORD} id={NAMES.PASSWORD} name={NAMES.PASSWORD} value={''} />
      {/if}
      <button type={BUTTON_TYPES.SUBMIT}>Profil aktuallisieren</button>
    </form>
  {/if}
</SettingsPage>
