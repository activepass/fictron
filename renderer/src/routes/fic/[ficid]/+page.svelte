<script lang='ts'>
	import { onMount } from 'svelte';
    import type { MinFicDetail } from '$shared/Fic';
	import Ao3DetailPanel from '$components/Ao3DetailPanel.svelte';
	import FfnDetailPanel from '$components/FfnDetailPanel.svelte';

    export let data;
    let fic: Promise<MinFicDetail | null>;
    $: {
        fic = window.fictron!.getMinFicDetail(data.id)

    }

    

</script>

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

<div class="panels">
    <Ao3DetailPanel library_id={data.id} />
    <FfnDetailPanel library_id={data.id} />
</div>

<style>
    .panels {
        display: flex;
        justify-content: center;
        gap: 20px;
    }
</style>