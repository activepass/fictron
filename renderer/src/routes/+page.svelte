<script lang='ts'>
	import { Ao3Source } from "$shared/Ao3";
    import { goto } from '$app/navigation';

    let search: HTMLInputElement;

    function addUrl() {
        if (search.value.startsWith(new Ao3Source().base_url)) {
            goto(`/fic?src=${search.value}`);
        }
    }
</script>
<h1>Test</h1>
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