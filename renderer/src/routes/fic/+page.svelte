<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
    import type { PageData } from './$types';
	import { ao3_url, ffn_url } from '$shared/Constants';
    
    export let data: PageData;

    async function addFic() {
        if (data.fic!.startsWith(ao3_url)) {
            let num = await window.fictron?.addAo3FicToLibrary(data.fic!);
            goto(`/fic/${num}`);
        }
        else if (data.fic!.startsWith(ffn_url)) {
            let num = await window.fictron?.addFFNetFicToLibrary(data.fic!);
            goto(`/fic/${num}`);
        }
    }

    

    onMount(() => {
        if (data.redirect) {
            goto("/")
            return;
        }
        addFic()
    })

</script>

<!-- <h1>Fic {data.fic}</h1> -->
<button on:click={addFic}>Add</button>
