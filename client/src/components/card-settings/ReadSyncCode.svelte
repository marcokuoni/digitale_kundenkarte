{#if !visible}
    <button class="overlay-button" on:click|stopPropagation={handleReadClick}>Sync Code einlesen</button>

{:else}
    {#if isOnline}
        <label for="code-input">Code eingeben:</label>
        <div class="input-wrapper">
            <input id="code-input" type="number" bind:value={codeInput} on:click|stopPropagation>
            <button class="sync-button" on:click|stopPropagation={handleInputClick}>Sync</button>
        </div>
        <p class="sync-code-text" on:click|stopPropagation>Klicke auf deinem alten Gerät auf 'Sync Code Generieren' und gib diesen Code ein. Der Code ist 10 Minuten gültig.</p>
        {#if showError} <p>Dein Code ist ungültig.</p> {/if}
        {#if showSuccess} <p>Hat geklappt, deine Karten wurden übernommen.</p> {/if}
    {:else}
        <p class="sync-code-text" on:click|stopPropagation>Du musst eine Internetverbindung haben um einen Sync Code eingeben zu können.</p>
    {/if}
{/if}


<script lang="ts">

    let visible = false

    let isOnline = false

    let showError = false
    let showSuccess = false

    let codeInput: string | number = ''

    function handleReadClick() {
        // TODO: check if app is online
        isOnline = true
        if (isOnline) visible = true
    }

    function handleInputClick(): void {
        // reset UI
        showError = false
        showSuccess = false

        const pattern = /^\d{6}$/gm
        // guard against invalid inputs
        if (!codeInput.toString().match(pattern)) {
            showError = true
            return
        }
        // TODO: fetch user from the server
        showSuccess = true
    }

</script>

<style>

    .input-wrapper {
        display: flex;
        padding: 4px 0;
    }

    .sync-code-text {
        font-size: 11pt;
        line-height: 12pt;
        color: var(--secondary-color);
        text-align: center;
        padding: 0 40px;
        margin-bottom: 12px;
    }

    #code-input {
        font-family: "Fira Code", monospace;
        font-weight: bold;
        font-size: 26pt;
        text-align: center;

        max-width: 200px;

        color: var(--foreground-color);
        background-color: var(--background-color);
        border: 2px solid var(--accent-color);
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        outline: none;
    }

    .sync-button {
        color: var(--foreground-color);
        background-color: var(--accent-color);
        font-weight: bold;
        padding: 0 12px;
        margin-left: -1px;

        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border: none;
        outline: none;
    }

</style>
