<script lang="ts">
	import { getRelativeTime, toLocale } from "$lib/RelativeTime";
	import type { Ao3FicDetail } from "$shared/Ao3";

    export let library_id;
    let detail: Promise<Ao3FicDetail | null>;

    $: {
       detail = window.fictron!.getAo3FicDetail(library_id);
       detail.finally(() => {
            console.log(detail)
        })
    }
</script>

<h3>This is an ao3 panel</h3>
{#await detail}
    <p>Loading Ao3 Fic</p>
{:then fic} 
    {#if fic}
        <p>Words: {fic.words}</p>
        <p>Chapters: {fic.chapters}</p>
        <p>Publish Date: {toLocale(fic.publish_time)}</p>
        <p>Updated Date: {toLocale(fic.update_time)}</p>
        <p>Last Checked: {getRelativeTime(fic.last_check)}</p>
    {:else}
        <p>Does Not have an Ao3 Source</p>
    {/if}
{/await}