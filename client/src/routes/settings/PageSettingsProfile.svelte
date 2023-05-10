<script lang="ts">
  import gql from 'graphql-tag'

  import { updateUser } from '../../codegen'
  import currentUser from '../../stores/currentUser'
  import NavLink from '../../components/NavLink.svelte'
  import { PATHS } from '../../lib/const'
  import SettingsPage from '../../components/SettingsPage.svelte'

  async function submitUpdateUser(event: SubmitEvent) {
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      // create a new FormData object from the form inputs
      const formData = new FormData(forms)

      // get the form data values
      const _id = formData.get('_id')?.toString()
      const name = formData.get('name')?.toString()
      const email = formData.get('email')?.toString()
      const newsletter = formData.get('newsletter')?.toString() === 'true'
      const password = formData.get('password')?.toString()

      const { data } = await updateUser({
        variables: {
          _id,
          name,
          email,
          newsletter,
          password,
        },
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
  }
</script>

<SettingsPage title="Benutzerkonto">
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
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={$currentUser && $currentUser.email}
      />
      <label for="newsletter"
        ><input
          type="checkbox"
          id="newsletter"
          name="newsletter"
          value="true"
          checked={$currentUser && $currentUser.newsletter}
        /> Wants Newsletter</label
      >
      <!-- TODO: Password should only be visible if requested -->
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        value={''}
        required={$currentUser?.userRoles && $currentUser.userRoles.length > 0}
      />
      <button type="submit">Update User</button>
    </form>
  {/if}

  <footer>
    <NavLink to={`${PATHS.SETTINGS}`}>Einstellungen</NavLink>
    <NavLink to={PATHS.CARD}>Zu meiner Karte</NavLink>
  </footer>
</SettingsPage>

<style>
</style>
