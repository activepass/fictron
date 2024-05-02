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
    let next_btn: HTMLElement;
    let prev_btn: HTMLElement;
    let src: HTMLElement;
    let content_wrapper: HTMLElement;

    async function LoadContent() {
        if (!url) {
            title.textContent = "No URL Provided";
            content.textContent = "Please provide a URL to read";
            document.title = "No URL Provided - Fictron";
            src.innerHTML = ""
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
            src.innerHTML = ""
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
        src.innerHTML = `src: <a href="${u}" target="_blank">${url}</a>`;
        if (fic.previous) {
            prev_btn.hidden = false;
            prev_btn.onclick = () => {
                url = fic.previous!;
            }
        } else {
            prev_btn.hidden = true;
        }
        if (fic.next) {
            next_btn.hidden = false;
            next_btn.onclick = () => {
                url = fic.next!;
            }
        } else {
            next_btn.hidden = true;
        }
        reporter?.reportChapter(fic.chapter);
    }


    $: {
        url;
        LoadContent();
    }

</script>


<button bind:this={prev_btn} hidden>Previous</button>
<button bind:this={next_btn} hidden>Next</button>
<span bind:this={src}></span>
<hr>
<ReaderSettings content_wrapper={content_wrapper}/>

<div class="content" bind:this={content_wrapper}>
    <!-- svelte-ignore a11y-missing-content -->
    <h1 bind:this={title}></h1>
    <p class="text-wrapper" bind:this={content}></p>
</div>
<!-- TODO: do dark mode for the reader in a better way that doesnt affect all pages -->
<style> 
    .content {
        text-align: center;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .text-wrapper {
        padding-left: 1em;
        padding-right: 1em;
    }

    /* TODO: MOVE THIS OUT OF READER */
    /* body {
        background-color: #fff;
        color: #000;
        transition: color 0.4s, background-color 0.4s;
    }

    body.dark {
        background-color: #1a1a1a;
        color: #fff;
    }

    body.dark a {
        color: #00cc99;
        transition: color 0.4s;
    } */

    img {
        max-width: 99%;
    }

</style>