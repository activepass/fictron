<script lang='ts'>
	import { onMount } from 'svelte';
    import type { MinFicDetail } from '$shared/Fic';
	import Ao3DetailPanel from '$components/Ao3DetailPanel.svelte';

    export let data;
    let fic: Promise<MinFicDetail | null>;
    $: {
        fic = window.fictron!.getMinFicDetail(data.id)

    }

    

</script>

<h1>Fic {data.id}</h1>
{#await fic}
    <p>Loading Fic</p>
{:then fic} 
    {#if fic}
        <h1>{fic.name}</h1>
        <h2>By: {fic.author_name}</h2>
    {:else}
        <p>Fic not found</p>
    {/if}
{/await}

<Ao3DetailPanel library_id={data.id} />