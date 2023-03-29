<main>

    <section class="card-section">
        <div class="card-wrapper">
            <Card stamps="{stampsPlaceholder}"/>
        </div>
        <button class="all-cards-button">ALLE KARTEN</button>
    </section>

    <section class="info-section">
        <div class="info-wrapper">
            <p class="info-label">NAME</p>
            <p class="info-text">Silvan Helbling</p>

            <div class="info-group">
                <div>
                    <p class="info-label">STEMPEL</p>
                    <p class="info-text">4<span class="stamps-secondary-text">/ 8</span></p>
                </div>
                <div>
                    <p class="info-label">LETZTER</p>
                    <p class="info-text">vor 12 Tagen</p>
                </div>
            </div>
        </div>
    </section>

    <section class="footer-section">
        <div class="footer">
            <button>EINSTELLUNGEN</button>
            <a href="https://thecrownbar.ch">WEBSITE</a>
            <a href="https://instagram.com/thecrownbarrappi">INSTAGRAM</a>
        </div>
    </section>

    <section>
        <!-- TODO: implement settings overlay -->
    </section>

    <!--
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
    -->

    <!--<button on:click={logUsers}>Log users</button>-->
    <!--
    <p>Add user:</p>
    <input type="text" placeholder="username" bind:value={inputName}/>
    <input type="email" placeholder="email" bind:value={inputEmail}/>
    <input type="checkbox" name="newsletter" bind:checked={inputNewsletter}/>
    <button on:click={handleUserClick} disabled={inputName.length === 0}>Add User</button>
    -->
</main>

<script lang="ts">
    import {addUser, getUsers} from '../codegen.js'
    import gql from 'graphql-tag'
    import Stamp from '../components/Stamp.svelte'
    import Card from '../components/Card.svelte'

    let inputName = ''
    let inputEmail = ''
    let inputNewsletter = false

    $: getUsersQuery = getUsers({})

    const stampsPlaceholder = [
        new Date('2023-03-02T18:00:00.000Z'),
        new Date('2023-03-09T18:00:00.000Z'),
        new Date('2023-03-16T18:00:00.000Z'),
        new Date('2023-03-23T18:00:00.000Z'),
    ]

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

<style>

    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 80vh;
    }

    .card-wrapper {
        width: 80vw;
    }

    .card-section {
        width: 100vw;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    button, a {
        padding: 2px 4px;

        font-size: 8pt;
        font-weight: bold;
        color: var(--secondary-color);
        background-color: transparent;

        border: none;
        text-decoration: none;
    }

    .all-cards-button {
        margin-top: 20px;
    }

    /* info */

    .info-section {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .info-wrapper {
        width: 80vw;
        max-width: 400px;
        margin: 40px -20px -20px;
    }

    .info-group {
        display: flex;
        margin-top: 20px;
    }

    .info-group div {
        margin-right: 20px;
    }

    .info-label {
        font-size: 9pt;
        font-weight: bold;
        color: var(--accent-color);
    }

    .info-text {
        font-size: 22pt;
        font-family: "Tiempos Fine", serif;
        font-weight: bold;
    }

    .stamps-secondary-text {
        color: var(--secondary-color);
        font-size: 14pt;
        margin-left: 4px;
    }

    /* footer */

    .footer-section {
        position: absolute;
        bottom: 40px;
        width: 100vw;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .footer {
        width: 70vw;
        max-width: 400px;
    }

</style>