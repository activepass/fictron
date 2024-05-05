<script lang='ts'>
	import FicPanel from "$components/FicPanel.svelte";
</script>
{#await window.fictron?.getLibraryRecent()}
    <p>Loading</p>
{:then library} 
    {#if library && library.length > 0}
        <h2>Recently Read &gt;</h2>
        <div class="panel-wrapper">
            {#each library as fic}
            <FicPanel fic={fic} />
            {/each}
        </div>
    {/if}
{/await}

<style>
    .panel-wrapper {
        display: flex;
        /* justify-content: center; */
        flex-direction: row;
        gap: 10px;
        flex-wrap: wrap;
    }
</style>

