<script lang="ts">
  import gql from 'graphql-tag'

  import { updateUser } from '../codegen'
  import { currentUser, fetchCurrentUser } from '../lib/currentUserStore'
  import { onMount } from 'svelte'

  onMount(() => {
    fetchCurrentUser()
  })

  async function submitUpdateUser(event: SubmitEvent) {
    const forms = event.target as HTMLFormElement
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
      update: (cache, { data: { updateUser } }) => {
        cache.writeFragment({
          id: `User:${_id}`,
          fragment: gql`
            fragment UpdateUser on User {
              name
              email
              newsletter
            }
          `,
          data: updateUser,
        })
      },
      optimisticResponse: {
        updateUser: {
          __typename: 'User',
          _id,
          name,
          email,
          newsletter,
          cards: new Array(),
          transfercode: $currentUser.transfercode,
          createdAt: $currentUser.createdAt,
          updatedAt: Date.now(),
        },
      },
    })

    if (data && data.updateUser) {
      fetchCurrentUser()
      console.log('User updated')
    } else {
      console.error('Error')
    }
  }
</script>

<main>
  <h1>Benutzerkonto</h1>
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
    <input type="password" id="password" name="password" value={''} />
    <button type="submit">Update User</button>
  </form>
</main>

<style>
</style>
