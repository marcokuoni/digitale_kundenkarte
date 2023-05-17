<script lang="ts">
  import MoreRightsPage from '../../components/layouts/MoreRightsPageLayout.svelte'
  import { getUsersWithPassword, updateUserRoles } from '../../codegen'
  import { Wave } from 'svelte-loading-spinners'
  import { BUTTON_TYPES, FETCH_POLICY, INPUT_TYPES, NAMES, USER_ROLES } from '../../lib/const'

  let loading = false
  let error = ''
  $: query = getUsersWithPassword({
    fetchPolicy: FETCH_POLICY.NETWORK_ONLY,
  })

  async function submitUpdateUser(event: SubmitEvent) {
    loading = true
    const forms = event.target as HTMLFormElement
    if (forms.checkValidity()) {
      const formData = new FormData(forms)

      const _id = formData.get(NAMES.ID)?.toString()
      const userRoles = formData.getAll(NAMES.USER_ROLES) as USER_ROLES[]
      
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

<MoreRightsPage title="Benutzer Gruppen verwalten">

  {#if loading} <Wave size="100" color="#FF3E00" unit="px" /> {/if}

  {#if $query.error || error} <span>{$query?.error?.message || error}</span> {/if}

  <div class="user-groups-list">

    {#each $query.data?.getUsersWithPassword || [] as user}
      <div class="user-group-block">

        <div class="user-group-item">
          <p>ID:</p>
          <p>{user._id || "–"}</p>
        </div>

        <div class="user-group-item">
          <p>E-Mail:</p>
          <p>{user.email || "–"}</p>
        </div>

        <div class="user-group-item">
          <p>Gruppenname:</p>
          <p>{user.name || "–"}</p>
        </div>

        <div class="user-group-item">
          <form on:submit|preventDefault={submitUpdateUser}>

            <input type={INPUT_TYPES.HIDDEN} id={NAMES.ID} name={NAMES.ID} value={user._id} />

            <label>
              <input type={INPUT_TYPES.CHECKBOX}
                     id={USER_ROLES.ADMIN}
                     name={NAMES.USER_ROLES}
                     value={USER_ROLES.ADMIN}
                     checked={user.userRoles.includes(USER_ROLES.ADMIN)}/>
              Administrator
            </label>

            <label >
              <input type={INPUT_TYPES.CHECKBOX}
                     id={USER_ROLES.EMPLOYEE}
                     name={NAMES.USER_ROLES}
                     value={USER_ROLES.EMPLOYEE}
                     checked={user.userRoles.includes(USER_ROLES.EMPLOYEE)}/>
              Mitarbeiter
            </label>



            <button class="default-button" type={BUTTON_TYPES.SUBMIT}>Benutzer aktualisieren</button>

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

  .user-group-block {
    border: 1px solid var(--background-raised-color);
    border-radius: 8px;
    padding: 12px;
  }

  .user-group-item {
    margin: 8px 0;
  }

  .user-group-item p:nth-child(1) {
    opacity: 0.5;
  }

</style>
