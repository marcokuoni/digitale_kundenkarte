<script lang="ts">
  import { updateUser, type UpdateUserMutationVariables } from '../../codegen'
  import currentUser from '../../stores/currentUser'
  import SettingsPage from '../../components/SettingsPage.svelte'
  import { Wave } from 'svelte-loading-spinners'

  let loading = false

  async function submitUpdateUser(event: SubmitEvent) {
    loading = true
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)

      const _id = formData.get('_id')?.toString()
      const name = formData.get('name')?.toString()
      const email = formData.get('email')?.toString()
      const newsletter = formData.get('newsletter')?.toString() === 'true'
      const password = formData.get('password')?.toString()

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

<SettingsPage title="Benutzerkonto">
  {#if loading}
    <Wave size="100" color="#FF3E00" unit="px" />
  {/if}
  {#if !$currentUser}
    <h2>Kein Benutzer gefunden</h2>
  {:else}
    <h2>Dein Transfercode: {$currentUser && $currentUser.transfercode}</h2>
    <form on:submit|preventDefault={submitUpdateUser}>
      <input
        type="hidden"
        id="_id"
        name="_id"
        value={$currentUser && $currentUser._id}
      />
      <label for="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        value={$currentUser && $currentUser.name}
      />
      <label for="email">E-Mail</label>
      <input
        type="email"
        id="email"
        name="email"
        required={$currentUser?.userRoles && $currentUser.userRoles.length > 0}
        value={$currentUser && $currentUser.email}
      />
      <label for="newsletter"
        ><input
          type="checkbox"
          id="newsletter"
          name="newsletter"
          value="true"
          checked={$currentUser && $currentUser.newsletter}
        /> Will Newsletter</label
      >
      {#if $currentUser?.userRoles && $currentUser.userRoles.length > 0}
        <label for="password">Passwort</label>
        <input type="password" id="password" name="password" value={''} />
      {/if}
      <button type="submit">Benutzer aktuallisieren</button>
    </form>
  {/if}
</SettingsPage>
