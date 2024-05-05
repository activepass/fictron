<script lang='ts'>
    import type { FicContent } from "$shared/Fic";
    import type { ChapterReporter } from "$lib/ChapterReporter";
    import { onMount } from "svelte";
	import ReaderSettings from "./ReaderSettings.svelte";
	import { ao3_url, ffn_url } from "$shared/Constants";

    export let url: string;
    export let reporter: ChapterReporter | undefined = undefined;



    let title: HTMLElement;
    let content: HTMLElement;
    let prev_url = "";
    let next_url = "";
    let content_wrapper: HTMLElement;

    async function LoadContent() {
        if (!url) {
            title.textContent = "No URL Provided";
            content.textContent = "Please provide a URL to read";
            document.title = "No URL Provided - Fictron";
            return;
        }

        if (url.startsWith(ao3_url)) {
            let t = await window.fictron?.getAo3FicContent(url);
            ParseContent(t!, url);
        } else if (url.startsWith(ffn_url)) {
            let t = await window.fictron?.getFFNetFicContent(url);
            ParseContent(t!, url);
        } else {
            title.textContent = "Invalid URL";
            content.textContent = "Please enter a valid URL";
            document.title = "Invalid URL - Fictron";
        }
    }

    function ParseContent(fic: FicContent, u: string) {
        content.innerHTML = fic.content;
        if (fic.chapter > 0) {
            title.textContent = `${fic.title} - Chapter ${fic.chapter}`;
            document.title = `${fic.title} - Chapter ${fic.chapter} - Fictron`;
        } else {
            title.textContent = fic.title;
            document.title = fic.title + " - Fictron";
        }
        if (fic.previous) {
            document.querySelectorAll(".prev")?.forEach(e => e.classList.remove("hidden"));
            prev_url = fic.previous!;
        } else {
            document.querySelectorAll(".prev")?.forEach(e => e.classList.add("hidden"));
        }
        if (fic.next) {
            document.querySelectorAll(".next")?.forEach(e => e.classList.remove("hidden"));
            next_url = fic.next!;
        } else {
            document.querySelectorAll(".next")?.forEach(e => e.classList.add("hidden"));
        }
        reporter?.reportChapter(fic.chapter);
    }

    function GoPrev() {
        if (!prev_url || prev_url.trim() == "") return;
        url = prev_url;
    }

    function GoNext() {
        if (!next_url || next_url.trim() == "") return;
        url = next_url;
    }

    $: {
        url;
        LoadContent();
    }

</script>

<div class="chapbtns">
    <button on:click={GoPrev} class="prev hidden">Previous</button>
    <ReaderSettings content_wrapper={content_wrapper}/>
    <button on:click={GoNext} class="next hidden">Next</button>
</div>

<div class="content" bind:this={content_wrapper}>
    <!-- svelte-ignore a11y-missing-content -->
    <h1 bind:this={title}></h1>
    <p class="text-wrapper" bind:this={content}></p>
</div>

<div class="chapbtns">
    <button on:click={GoPrev} class="prev hidden">Previous</button>
    <button on:click={GoNext} class="next hidden">Next</button>
</div>

<style> 
    .hidden {
        opacity: 0;
    }
    .chapbtns {
        padding-top: 1em;
        display: flex;
        justify-content: space-between;
        padding-left: 1em;
        padding-right: 1em;
    }

    .chapbtns:has(.prev[hidden]) {
        flex-direction: row-reverse;
    }

    .chapbtns button:not(.hidden) {
        cursor: pointer;
    }

    .content {
        text-align: center;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .text-wrapper {
        padding-left: 1em;
        padding-right: 1em;
    }



</style>