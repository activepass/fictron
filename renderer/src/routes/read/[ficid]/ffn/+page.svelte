<script lang='ts'>
	import Reader from "$components/Reader.svelte";
	import { FfnChapterReporter } from "$lib/ChapterReporter.js";

    export let data;
    let url: Promise<string>;
    
    $: {
        url = window.fictron!.getFfnFicUrl(data.ficid, data.chapter);
    }

</script>

{#await url}
    <p>Loading Ffn Fic</p>
    
{:then url} 
    <Reader url={url} reporter={new FfnChapterReporter(data.ficid)}/>
{/await}

