<main>
    <h1>Card Page</h1>

    {#if $getUsersQuery.loading}
        <p>loading...</p>
    {:else}
        {#if $getUsersQuery.data?.getUsers.length === 0}
            <p>No User (Add some!)</p>
        {/if}
        {#each $getUsersQuery.data?.getUsers || [] as user, i}
            <div>User {i + 1} -&gt; {user.name}</div>
        {/each}
        <button on:click={() => $getUsersQuery.query.refetch({})}>Refresh</button>
    {/if}

    <!--<button on:click={logUsers}>Log users</button>-->

    <p>Add user:</p>
    <input type="text" placeholder="username" bind:value={inputName}/>
    <input type="email" placeholder="email" bind:value={inputEmail}/>
    <input type="checkbox" name="newsletter" bind:checked={inputNewsletter}/>
    <button on:click={handleUserClick} disabled={inputName.length === 0}>Add User</button>
</main>


<script lang="ts">
    import {addUser, getUsers} from '../codegen.js'
    import gql from 'graphql-tag'

    let inputName = ''
    let inputEmail = ''
    let inputNewsletter = false

    $: getUsersQuery = getUsers({})

    /*function logUsers() {
        console.log(getUsersQuery)
    }*/

    async function handleUserClick() {
        console.log('adding user')
        const res = await addUser({
            variables: {
                name: inputName,
                email: inputEmail,
                newsletter: inputNewsletter,
            },

            update: (cache, { data: { addUser } }) => {
                cache.modify({
                    fields: {
                        getUsers(existingUsers = []) {
                            const newUserRef = cache.writeFragment({
                                data: addUser,
                                fragment: gql`
                                    fragment NewUser on User {
                                        __typename
                                        _id
                                        email
                                        newsletter
                                        cards
                                        createdAt
                                        updatedAt
                                        name
                                    }
                                `,
                            })
                            return existingUsers.concat(newUserRef)
                        },
                    },
                })
            },

            optimisticResponse: {
                addUser: {
                    __typename: 'User',
                    _id: new Date().getTime(),
                    email: '',
                    newsletter: false,
                    cards: [],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    name: inputName,
                },
            },
        })

        inputName = ''
        console.log('result:')
        console.log(res)
    }

</script>
