<script lang="ts">
	import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    
    export let data: PageData;

    if (data.redirect) {
        goto("/")
    }
</script>

<h1>Fic {data.fic}</h1>