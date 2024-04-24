<script lang='ts'>
	import type { FicContent } from "$shared/Fic";
    import { onMount } from "svelte";

    export let url: string;

    const ao3 = "https://archiveofourown.org/";
    const ffnet = "https://www.fanfiction.net/";

    let title: HTMLElement;
    let content: HTMLElement;
    let next_btn: HTMLElement;
    let prev_btn: HTMLElement;
    let src: HTMLElement;

    async function LoadContent() {
        if (url.startsWith(ao3)) {
            let t = await window.fictron?.getFicContent(url);
            ParseContent(t!, url);
        } else if (url.startsWith(ffnet)) {
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
    }


    $: {
        url;
        LoadContent();
    }

</script>


<button bind:this={prev_btn} hidden>Previous</button>
<button bind:this={next_btn} hidden>Next</button>
<span bind:this={src}></span>


<h1 bind:this={title}></h1>
<p bind:this={content}></p>
