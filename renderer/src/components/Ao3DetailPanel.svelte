<script lang="ts">
	import { getRelativeTime, toLocale } from "$lib/RelativeTime";
	import type { Ao3FicDetail } from "$shared/Ao3";
	import { ao3_url } from "$shared/Constants";

    export let library_id: number;
    let detail: Promise<Ao3FicDetail | null>;
    let Ao3Fic: Ao3FicDetail | null = null;

    let input: HTMLInputElement;

    async function LinkFic() {
        console.log(library_id)
        if (!input || !input.value.startsWith(ao3_url)) {
            console.log("No/bad Input")
            return;
        }
        let num = await window.fictron?.linkAo3Fic(library_id, input.value);
        console.log(num)
        detail = detail
    }

    async function CheckFic() {
        if (!Ao3Fic) {
            console.log("No Ao3 Fic")
            return;
        }
        let num = await window.fictron?.addAo3FicToLibrary(Ao3Fic.src_url);
        console.log(num)
        detail = detail
    }

    $: {
       detail = window.fictron!.getAo3FicDetail(library_id);
       detail.then((thing) => {
            console.log(thing)
            if (thing) {
                Ao3Fic = thing;
            }
        })
    }
</script>

<div class="pane">
    {#await detail}
    <p>Loading Ao3 Fic</p>
    {:then fic} 
        {#if fic}
            <h2 class="source">Archive of Our Own</h2>
            {#if fic.recent_chapter <= 0}
                <a href="/read/{fic.library_id}/ao3">Start Reading</a>
            {:else }
                <a href="/read/{fic.library_id}/ao3?chapter={fic.recent_chapter}">Continue (ch.{fic.recent_chapter})</a>
            {/if}
            <p>Words: {fic.words}</p>
            <p>Chapters: {fic.chapters}</p>
            {#if fic.complete}
                <p style="color: green;">Complete</p>
            {:else}
                <p style="color: red;">Incomplete</p>
            {/if}
            <p>Publish Date: {toLocale(fic.publish_time)}</p>
            <p>Updated Date: {toLocale(fic.update_time)}</p>
            <p>Last Checked: {getRelativeTime(fic.last_check)}</p>
            <button on:click={CheckFic}>Update</button>
        {:else}
            <h2 class="source">Archive of Our Own</h2>
            <p>Does Not have an Ao3 Source</p>
            <p>Add one:</p>
            <input bind:this={input} type="text">
            <button on:click={LinkFic}>Link</button>
        {/if}
    {/await}
</div>

<style>
    .pane {
        display: inline-flex;
        padding: 1em;
        flex-direction: column;
        align-items: center;
        border: 2px solid #900;
    }
    p {
        margin: 0.5em;
    }
    h2.source {
        margin-top: 0;
    }
</style>