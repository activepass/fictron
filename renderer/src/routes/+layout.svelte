<script lang='ts'>
	import { onMount } from "svelte";

    let darkmodebutton: HTMLButtonElement
    let darkmode_state = localStorage.getItem('darkmode') === 'true'
    
    function toggleDarkMode() {
        darkmode_state = !darkmode_state
        document.body.classList.toggle('dark')
        localStorage.setItem('darkmode', darkmode_state.toString())
    }

    if (darkmode_state) {
        document.body.classList.add('dark')
    }

    onMount(() => {
        setTimeout(() => {
            document.body.style.transition = 'background-color 0.4s, color 0.4s';
        }, 100)
    })
    
</script>
<svelte:head>
    <title>Fictron</title>
    <link rel="stylesheet" href="/globals.css">
</svelte:head>
<svelte:body  />
<nav>
    <a href="/">Home</a>
    <a href="/library">library</a>
    <button style="float: right;" bind:this={darkmodebutton} on:click={toggleDarkMode}>Dark</button>
</nav>
<hr>
<slot />
<style is:global>

    body {
        background-color: #fff;
        color: #000;
    }

    body a {
        transition: color 0.4s;
    }

    body.dark {
        background-color: #1a1a1a;
        color: #fff;
    }

    body.dark a {
        color: #00cc99;
    }

    
</style>