{#if !visible}
    <button class="overlay-button" on:click|stopPropagation={handleGenerateCodeClick}>Sync Code generieren</button>

{:else}
    {#if isOnline}
        <p class="sync-code" on:click|stopPropagation>{generatedCode}</p>
        <p class="sync-code-text" on:click|stopPropagation>Klicke auf deinem neuen Gerät auf 'Sync Code Einlesen' und gib diesen Code ein. Der Code ist 10 Minuten gültig.</p>
    {:else}
        <p class="sync-code-text" on:click|stopPropagation>Du musst eine Internetverbindung haben um einen Sync Code kreieren zu können.</p>
    {/if}
{/if}


<script lang="ts">

    let visible = false

    let isOnline = false
    let generatedCode = '--- ---'

    function handleGenerateCodeClick() {
        // TODO: check if app is online
        isOnline = true

        if (isOnline)
            // TODO: fetch code for this user from the server
            generatedCode = '904 173'
        visible = true
    }

</script>

<style>

    .sync-code {
        font-family: "Fira Code", monospace;
        font-weight: bold;
        font-size: 26pt;
    }

    .sync-code-text {
        font-size: 11pt;
        line-height: 12pt;
        color: var(--secondary-color);
        text-align: center;
        padding: 0 40px;
        margin-bottom: 12px;
    }

</style>
