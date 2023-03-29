{#if !visible}
    <button class="overlay-button" on:click|stopPropagation={handleRenameClick}>Karte umbenennen</button>
{:else}
    <div class="rename-wrapper">
        <input id="rename-input" type="text" maxlength="25" on:click|stopPropagation bind:value={renameInput}>
        <button class="rename-button" on:click|stopPropagation={handleRenameInputClick}>Speichern</button>
    </div>
    {#if showSuccess} <p>Karte erfolgreich umbenannt</p> {/if}
    {#if showError} <p>Es gab ein Fehler, überprüfe deine Internetverbindung und probiere es später noch einmal.</p> {/if}
{/if}

<script lang="ts">

    let visible = false
    let showSuccess = false
    let showError = false

    let renameInput: string = ''

    function handleRenameClick() {
        showSuccess = false
        showError = false
        visible = true
    }

    function handleRenameInputClick() {
        // TODO: handle card renaming

        renameInput = ''
        showSuccess = true
    }

</script>

<style>

    .rename-wrapper {
        display: flex;
        padding: 8px 0;
    }

    #rename-input {
        font-weight: bold;
        font-size: 16pt;
        /*text-align: center;*/

        max-width: 260px;

        color: var(--foreground-color);
        background-color: var(--background-color);
        border: 2px solid var(--accent-color);
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        outline: none;
    }

    .rename-button {
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
