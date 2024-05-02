<script>
	import Reader from "$components/Reader.svelte";

    export let data;
    let url = window.fictron?.getAo3FicUrl(data.ficid, data.chapter);

</script>

{#await url}
    <p>Loading Ao3 Fic</p>
    
{:then url} 
    <Reader url={url} />
{/await}

