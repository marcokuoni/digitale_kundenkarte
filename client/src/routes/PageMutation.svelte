<script lang="ts">
  import {
    addUser,
    getUsers,
    GetUsersDoc
  } from "../codegen";

  $: name = "";
  $: query = getUsers({});
</script>

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

<br />
<main class="cards">
  <div class="card">
    <h2>Add User</h2>
    <input placeholder="User name..." bind:value={name} />
    <button
      disabled={name.length === 0}
      on:click={() => {
        addUser({variables: {
                    name
                  },
        refetchQueries: [{ query: GetUsersDoc }],
                });
        name = '';
      }}>Add</button>
  </div>
  <div class="card">
    <h2>List of Codegen Users</h2>
    {#if $query.loading}
      <p>...loading users</p>
    {:else}
      {#if $query.data?.getUsers.length === 0}
        <p>No User (Add some!)</p>
      {/if}
      {#each $query.data?.getUsers || [] as user, i}
        <div>User {i + 1} -&gt; {user.name}</div>
      {/each}
      <button on:click={() => $query.query.refetch({})}>Refresh</button>
    {/if}
  </div>
</main>
