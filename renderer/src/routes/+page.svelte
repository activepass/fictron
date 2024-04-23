<script lang="ts">
	import { onMount } from "svelte";
    let testelement: HTMLElement;

    async function TestContent() {
        console.log("pre call");
        let t = await window.fictron?.getFicContent("https://archiveofourown.org/works/41979486");
        console.log("post call", t);
        testelement.innerHTML = t;
    }
</script>

<button on:click={TestContent}>Test</button>
<p bind:this={testelement}></p>
