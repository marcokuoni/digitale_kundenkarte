<h1>Card Page</h1>

<p>{ $dynUsers.data.getUsers }</p>
<button on:click={logUsers}>Log users</button>

<script lang="ts">
    /*
    // this kinda works but does not use the codegen stuff

    import {query, setClient} from 'svelte-apollo'
    import gql from 'graphql-tag'
    import client from '../apollo-client.js'

    setClient(client)

    const usersQueryDocument = gql`
    query User {
      getUsers {
        _id
        name
      }
    }
    `

    const users = query(usersQueryDocument)
    console.log(users)

    users.subscribe( (x) => {
        console.log(x)
        console.log('subscribed')
    })
    */

    // does not return any users even if there are in the db

    import { getUsers } from '../codegen.js'

    $: dynUsers = getUsers( {} )

    function logUsers() {
        console.log($dynUsers)
    }

</script>
