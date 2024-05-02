<script>
	import Reader from "$components/Reader.svelte";

    export let data;
    let url = window.fictron?.getFfnFicUrl(data.ficid, data.chapter);

</script>

{#await url}
    <p>Loading Ffn Fic</p>
    
{:then url} 
    <Reader url={url} />
{/await}

