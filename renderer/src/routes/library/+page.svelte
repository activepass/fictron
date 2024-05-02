<script lang='ts'>
	import FicPanel from "$components/FicPanel.svelte";


</script>

<h1>Library</h1>

{#await window.fictron?.getLibrary()}
    <p>Loading</p>
{:then library} 
    {#if library && library.length > 0}
        <div class="panel-wrapper">
            {#each library as fic}
                <FicPanel fic={fic} />
            {/each}
        </div>
    {:else}
        <p>Library is empty</p>
    {/if}
{/await}

<style>
    .panel-wrapper {
        display: flex;
        flex-direction: row;
        gap: 10px;
        flex-wrap: wrap;
    }
</style>