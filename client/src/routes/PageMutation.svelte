<script lang="ts">
  // import { addUser, getUsers, GetUsersDoc, AddUserDoc } from '../codegen'
  import gql from 'graphql-tag'

  $: name = ''
  // $: query = getUsers({})
</script>

<br />
<main class="cards">
  <div class="card">
    <h2>Add User</h2>
    <input placeholder="User name..." bind:value={name} />
    <button
      disabled={name.length === 0}
      on:click={() => {
        // addUser({
        //   variables: {
        //     name,
        //   },
        //   update: (cache, { data: { addUser } }) => {
        //     cache.modify({
        //       fields: {
        //         getUsers(existingUsers = []) {
        //           const newUserRef = cache.writeFragment({
        //             data: addUser,
        //             fragment: gql`
        //               fragment NewUser on User {
        //                 __typename
        //                 _id
        //                 email
        //                 newsletter
        //                 cards
        //                 createdAt
        //                 updatedAt
        //                 name
        //               }
        //             `,
        //           })
        //           return existingUsers.concat(newUserRef)
        //         },
        //       },
        //     })
        //   },
        //   optimisticResponse: {
        //     addUser: {
        //       __typename: 'User',
        //       _id: new Date().getTime(),
        //       email: '',
        //       newsletter: false,
        //       cards: new Array(),
        //       createdAt: Date.now(),
        //       updatedAt: Date.now(),
        //       name,
        //     },
        //   },
        // })
        name = ''
      }}>Add</button
    >
  </div>
  <div class="card">
    <h2>List of Codegen Users</h2>
    <!-- {#if $query.loading}
      <p>...loading users</p>
    {:else}
      {#if $query.data?.getUsers.length === 0}
        <p>No User (Add some!)</p>
      {/if}
      {#each $query.data?.getUsers || [] as user, i}
        <div>User {i + 1} -&gt; {user.name}</div>
      {/each}
      <button on:click={() => $query.query.refetch({})}>Refresh</button>
    {/if} -->
  </div>
</main>

<style>
  .cards {
    display: flex;
    justify-content: center;
  }

  .card {
    padding: 10px;
    background-color: rgb(173, 196, 178);
    box-shadow: 10px 5px 5px #ff3e00;
    margin: 20px;
  }
</style>
