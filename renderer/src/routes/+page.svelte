<script lang='ts'>
	import { ao3_url, ffn_url } from "$shared/Constants";
    import { goto } from '$app/navigation';
	import FicPanel from "$components/FicPanel.svelte";
	import { onMount } from "svelte";

    let search: HTMLInputElement;

    function go(id: number) {
        if (id == -1) {
            window.alert("Failed to add Fic!")
            return;
        }
        goto(`/fic/${id}`);
    }

    async function addUrl() {
        if (!search || !search.value || search.value.trim() == "") return;
        if (search.value.startsWith(ao3_url)) {
            let num = await window.fictron?.addAo3FicToLibrary(search.value);
            go(num!)
        }
        else if (search.value.startsWith(ffn_url)) {
            let num = await window.fictron?.addFFNetFicToLibrary(search.value);
            go(num!)
        }
    }

    onMount(() => {
        search.addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
                addUrl();
            }
        })
    })
</script>
<h1>Enter a Fic Url</h1>
<div class="nav">
    <input bind:this={search} class="url_input" type="text">
    <button on:click={addUrl}>Go</button>
</div>
{#await window.fictron?.getLibraryRecent()}
    <p>Loading</p>
{:then library} 
    {#if library && library.length > 0}
        <h2>Recently Read:</h2>
        <div class="panel-wrapper">
            {#each library as fic}
            <FicPanel fic={fic} />
            {/each}
        </div>
    {/if}
{/await}

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

    .panel-wrapper {
        display: flex;
        /* justify-content: center; */
        flex-direction: row;
        gap: 10px;
        flex-wrap: wrap;
    }
</style>

