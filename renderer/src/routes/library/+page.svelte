<script lang='ts'>

</script>

<h1>Library</h1>

{#await window.fictron?.getLibrary()}
    <p>Loading</p>
{:then library} 
    {#if library && library.length > 0}
        {#each library as fic}
            <a href="/fic/{fic.id}"><h2>{fic.name}</h2></a>
            <p>By: {fic.author_name}</p>
        {/each}
    {:else}
        <p>Library is empty</p>
    {/if}
{/await}