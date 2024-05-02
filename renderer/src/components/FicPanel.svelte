<script lang='ts'>
	import { goto } from "$app/navigation";
    import type { MinFicDetail } from "$shared/Fic";
    export let fic: MinFicDetail;

    function openFic() {
        goto(`/fic/${fic.id}`);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="pane" on:click={openFic}>
    <h2>{fic.name}</h2>
    <p>By: {fic.author_name}</p>

</div>

<style>
    .pane {
        display: inline-flex;
        padding: 0.5em;
        flex-direction: column;
        align-items: center;
        text-align: center;
        border: 2px solid black;
        width: 200px;
        min-width: 200px;
        height: 250px;
        justify-content: space-between;
    }

    .pane:hover {
        background-color: #f0f0f0;
        cursor: pointer;
    }

    .pane p {
        word-wrap: break-word;
        /* padding-left: 0.5em;
        padding-right: 0.5em; */
    }

</style>