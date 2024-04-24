<script lang="ts">
	import Reader from "$components/Reader.svelte";
    let url = "https://archiveofourown.org/works/41979486/";
    let input: HTMLInputElement;

    export function RandomFicId() {
        return Math.floor(Math.random() * 1000000);
    }

    async function TestContent() {
        url = `https://archiveofourown.org/works/${RandomFicId()}`
    }

    async function TestLocked() {
        url = `https://archiveofourown.org/works/906155`;
    }
    function TestStatic() {
        url = "https://archiveofourown.org/works/41979486/";

    }

    async function ffnetGet() {
        url = "https://www.fanfiction.net/s/13889193/";
    }

    function UrlGo() {
        url = input.value;
    }


</script>

<button on:click={TestContent}>Random Fic</button>
<button on:click={TestLocked}>Locked Fic</button>
<button on:click={TestStatic}>Static Fic</button>
<button on:click={ffnetGet}>Ffnet</button>
-----
<input bind:this={input} type="text">
<button on:click={UrlGo}>Go</button>
<hr>
<Reader url={url}></Reader>