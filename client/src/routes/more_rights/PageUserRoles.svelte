<script lang="ts">
  import MoreRightPage from '../../components/MoreRightPage.svelte'
  import { getUsersWithPassword, updateUserRoles } from '../../codegen'
  import { Wave } from 'svelte-loading-spinners'
  import { USER_ROLES } from '../../lib/const'

  let loading = false
  let error = ''
  $: query = getUsersWithPassword({
    fetchPolicy: 'network-only',
  })

  async function submitUpdateUser(event: SubmitEvent) {
    loading = true
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)

      const _id = formData.get('_id')?.toString()
      const userRoles = formData.getAll('userRoles') as USER_ROLES[]
      
      try {
        await updateUserRoles({
          variables: {
            _id,
            userRoles
          },
        })
        await $query.query.refetch()
        alert('Success')
      } catch (err) {
        error = err.message
      } finally {
        loading = false
      }
    }
    loading = false
  }
</script>

<MoreRightPage title="Benutzer Gruppen verwalten">
  {#if loading}
    <Wave size="100" color="#FF3E00" unit="px" />
  {/if}
  {#if $query.error || error}
    <span>{$query?.error?.message || error}</span>
  {/if}
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>E-Mail</th>
        <th>Name</th>
        <th>Benutzergruppen</th>
      </tr>
    </thead>
    <tbody>
      {#each $query.data?.getUsersWithPassword || [] as user}
        <tr>
          <td>{user._id}</td>
          <td>{user.email}</td>
          <td>{user.name}</td>
          <td>
            <form on:submit|preventDefault={submitUpdateUser}>
              <input type="hidden" id="_id" name="_id" value={user._id} />
              <label>
                <input
                  type="checkbox"
                  id={USER_ROLES.ADMIN}
                  name="userRoles"
                  value={USER_ROLES.ADMIN}
                  checked={user.userRoles.includes(USER_ROLES.ADMIN)}
                />
                Administrator
              </label>
              <label>
                <input
                  type="checkbox"
                  id={USER_ROLES.EMPLOYEE}
                  name="userRoles"
                  value={USER_ROLES.EMPLOYEE}
                  checked={user.userRoles.includes(USER_ROLES.EMPLOYEE)}
                />
                Mitarbeiter
              </label>
              <button type="submit">Benutzer aktuallisieren</button>
            </form>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</MoreRightPage>

<style>
</style>
