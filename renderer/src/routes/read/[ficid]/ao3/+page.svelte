<script lang='ts'>
	import Reader from "$components/Reader.svelte";
	import { Ao3ChapterReporter } from "$lib/ChapterReporter.js";

    export let data;
    let url: Promise<string>;

    $: {
        url = window.fictron!.getAo3FicUrl(data.ficid, data.chapter);
    }

</script>

{#await url}
    <p>Loading Ao3 Fic</p>
    
{:then url}
    <Reader url={url} reporter={new Ao3ChapterReporter(data.ficid)}/>
{/await}

