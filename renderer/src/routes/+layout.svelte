<script lang='ts'>
	import DarkModeIcon from "$components/DarkModeIcon.svelte";
	import FicSearch from "$components/FicSearch.svelte";
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
    <div class="navcontainer">
        <a href="/" class="navbtn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20px">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        </a>
        <!-- <input class="ficsearch" type="text" placeholder="Enter a fic url...">
        <div class="navbtn searchbtn" on:click={} role="button" tabindex="0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20px">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
        </div> -->
        <FicSearch />
        <a href="/library" class="navbtn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20px">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
        </a>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="navbtn darkmodebutton" on:click={toggleDarkMode} role="button" tabindex=0>
            <DarkModeIcon darkmode={darkmode_state} />
        </div>
        <!-- <button class="darkmodebutton" bind:this={darkmodebutton} on:click={toggleDarkMode}>Dark</button> -->
    </div>
</nav>
<hr>
<slot />
<style is:global>
    .navbtn {
        height: 20px;
        padding: 10px;
        border: 1px solid black;
        border-radius: 10px;
        transition: border-color 0.4s;
    }

    
    body.dark .navbtn {
        border-color: white;
    }

    nav {
        height: 40px;
    }

    .navcontainer {
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        align-items: center;
        gap: 10px;
    }

    .darkmodebutton {
        cursor: pointer;
        color: #42414d;
    }


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