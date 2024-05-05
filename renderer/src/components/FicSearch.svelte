<script lang='ts'>
    import { ao3_url, ffn_url } from "$shared/Constants";
    import { goto } from '$app/navigation';
    let search: HTMLInputElement;

    function go(id: number) {
        if (id == -1) {
            window.alert("Failed to add Fic!")
            return;
        }
        goto(`/fic/${id}`);
        search.value = "";
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
        } else {
            window.alert("Invalid URL")
        }
    }
    function enterPressed(e: KeyboardEvent) {
        if (e.key === "Enter") {
            addUrl()
        }
    }
</script>

<input class="ficsearch" type="text" placeholder="Enter a fic url..." bind:this={search} on:keydown={enterPressed}>
<div class="searchbtn navbtn" on:click={addUrl} role="button" tabindex="0" on:keydown={enterPressed}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20px">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
</div>

<style is:global>
    .searchbtn {
        border-radius: 0 10px 10px 0 !important;
        border-left: none !important;
        margin-left: -10px;
    }

    .searchbtn:hover {
        background-color: var(--book-hover);
        cursor: pointer;
    }

    body.dark .searchbtn:hover {
        background-color: var(--book-hover-dark);

    }

    .ficsearch {
        flex-grow: 1;
        padding-top: 5px;
        padding-bottom: 5px;
        height: 30px;
        border-radius: 10px 0 0 10px;
        border: 1px solid black;
        line-height: 20px;
        font-size: 15px;
        
        transition: color 0.4s, background-color 0.4s, border-color 0.4s;
    }

    body.dark .ficsearch {
        border-color: white;
        outline-color: white;
        background-color: #2a2a2a;
        color: white;
    }
</style>