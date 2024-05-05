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
<div class="library-pane" on:click={openFic}>
    <h2>{fic.name}</h2>
    <p>By: {fic.author_name}</p>

</div>

<style is:global>
    * {
        --book-outline: black;
        --book-outline-dark: white;
        --book-hover: #f0f0f0;
        --book-hover-dark: #333;
    }
    .library-pane {
        display: inline-flex;
        padding: 0.5em;
        flex-direction: column;
        align-items: center;
        text-align: center;
        border: 2px solid var(--book-outline);
        width: 200px;
        min-width: 200px;
        height: 250px;
        justify-content: space-between;
        transition: border-color 0.4s;
    }

    body.dark .library-pane {
        border: 2px solid var(--book-outline-dark);
    }

    .library-pane:hover {
        background-color: var(--book-hover);
        cursor: pointer;
    }

    body.dark .library-pane:hover {
        background-color: var(--book-hover-dark);
    }

    .library-pane p {
        word-wrap: break-word;
        /* padding-left: 0.5em;
        padding-right: 0.5em; */
    }

</style>