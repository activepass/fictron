<script lang="ts">
	import type { FicContent } from "$shared/Fic";
	import { onMount } from "svelte";
    let testelement: HTMLElement;
    let titleelement: HTMLElement;
    let next_btn: HTMLElement;
    let prev_btn: HTMLElement;
    let srcspan: HTMLElement;

    export function RandomFicId() {
        return Math.floor(Math.random() * 1000000);
    }

    async function TestContent() {
        let url = `https://archiveofourown.org/works/${RandomFicId()}`
        let t = await window.fictron?.getFicContent(url);
        ParseContent(t!, url);
    }

    async function TestLocked() {
        let url = `https://archiveofourown.org/works/906155`
        let t = await window.fictron?.getFicContent(url);
        ParseContent(t!, url);
    }
    function TestStatic() {
        UseUrl("https://archiveofourown.org/works/41979486/");
    }

    async function UseUrl(url: string) {
        let t = await window.fictron?.getFicContent(url);
        ParseContent(t!, url);
    }

    function ParseContent(fic: FicContent, url: string) {
        testelement.innerHTML = fic.content;
        titleelement.innerHTML = fic.title;
        srcspan.innerHTML = `src: <a href="${url}" target="_blank">${url}</a>`;
        if (fic.previous) {
            prev_btn.hidden = false;
            prev_btn.onclick = () => fic.previous?.startsWith("https://www.fanfiction.net") ? UseFFNet(fic.previous!) : UseUrl(fic.previous!);
        } else {
            prev_btn.hidden = true;
        }
        if (fic.next) {
            next_btn.hidden = false;
            next_btn.onclick = () => fic.next?.startsWith("https://www.fanfiction.net") ? UseFFNet(fic.next!) : UseUrl(fic.next!);
        } else {
            next_btn.hidden = true;
        }
    }

    async function ffnetGet() {
        let url = "https://www.fanfiction.net/s/13889193/";
        UseFFNet(url);
    }

    async function UseFFNet(url: string) {
        let t = await window.fictron?.getFFNetFicContent(url);
        ParseContent(t!, url);
    }
</script>

<button on:click={TestContent}>Random Fic</button>
<button on:click={TestLocked}>Locked Fic</button>
<button on:click={TestStatic}>Static Fic</button>
<button on:click={ffnetGet}>Ffnet</button>
----------
<button bind:this={prev_btn} hidden>Previous</button>
<button bind:this={next_btn} hidden>Next</button>
<br>
<span bind:this={srcspan}></span>
<hr>

<h1 bind:this={titleelement}></h1>
<p bind:this={testelement}></p>
