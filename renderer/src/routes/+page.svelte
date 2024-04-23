<script lang="ts">
	import { onMount } from "svelte";


    onMount(() => {
        window.electronAPI.requestProcessVersions();
    });
</script>


