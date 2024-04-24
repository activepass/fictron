<script lang='ts'>
	import type { Ao3Fic } from "$shared/Fic";
	import { onMount } from "svelte";

    let ao3Fic: Promise<Ao3Fic> | undefined;
    let url = "https://archiveofourown.org/works/41979486/"
    ao3Fic = window.fictron?.getAo3FicMetadata(url);

</script>

<h1>Getter</h1>
{#await ao3Fic}
    <p>Loading...</p>
{:then ao3Fic} 
    {#if (ao3Fic && ao3Fic.title !== "Failed")}
        <h2>{ao3Fic.title}</h2>
        <p>{ao3Fic.author}</p>
        <p>{ao3Fic.words}</p>
        <p>{ao3Fic.published}</p>
    {:else}
        <p>Failed to get fic metadata</p>
    {/if}
{/await}


