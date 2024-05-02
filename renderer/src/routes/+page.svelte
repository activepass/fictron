<script lang='ts'>
	import { ao3_url, ffn_url } from "$shared/Constants";
    import { goto } from '$app/navigation';

    let search: HTMLInputElement;

    function addUrl() {
        if (search.value.startsWith(ao3_url) || search.value.startsWith(ffn_url)) {
            goto(`/fic?src=${search.value}`);
        }
    }
</script>
<h1>Enter a Fic Url</h1>
<div class="nav">
    <input bind:this={search} class="url_input" type="text">
    <button on:click={addUrl}>Go</button>
</div>

<style>
    .nav {
        display: flex;
        /* justify-content: center; */
        align-items: center;
        margin: 10px;
    }
    .nav input {
        flex: 1;
        margin-right: 10px;
    }
    h1 {
        text-align: center;
    }
</style>