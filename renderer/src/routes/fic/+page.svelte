<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;

    async function addFic() {
        let num = await window.fictron?.addAo3FicToLibrary(data.fic!);
        goto(`/fic/${num}`);
    }

    

    onMount(() => {
        if (data.redirect) {
            goto("/")
            return;
        }
        addFic()
    })

</script>

<h1>Fic {data.fic}</h1>
<button on:click={addFic}>Add</button>
