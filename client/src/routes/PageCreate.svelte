<h1>Create User</h1>
<form on:submit|preventDefault={createUser}>
    <label for="name">Name</label>
    <input type="text" id="name" bind:value={name} />
    <label for="email">Email</label>
    <input type="email" id="email" bind:value={email} />
    <label for="newsletter"><input type="checkbox" id="newsletter" value="true" bind:checked={newsletter} /> Wants Newsletter</label>
     
    <label for="password">Password</label>
    <input type="password" id="password" bind:value={password} />
    <button type="submit">Create User</button>
</form>

<script>
    import { signUp } from '../codegen'
    import { navigate } from 'svelte-routing'

    let name = ''
    let email = ''
    let password = ''
    let newsletter = false

    async function createUser() {
        const { data } = await signUp({
            variables: {
                name,
                email,
                newsletter,
                password,
            },
        })
        if (data && data.signUp) {
            navigate('/card')
        } else {
            alert('Error')
        }
    }
</script>