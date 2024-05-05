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

    function darkModeKeydown(e: KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
            toggleDarkMode()
            e.preventDefault()
        }
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
        <FicSearch />
        <a href="/library" class="navbtn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20px">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
        </a>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="navbtn darkmodebutton" on:click={toggleDarkMode} role="button" tabindex=0 on:keydown={darkModeKeydown}>
            <DarkModeIcon darkmode={darkmode_state} />
        </div>
        <!-- <button class="darkmodebutton" bind:this={darkmodebutton} on:click={toggleDarkMode}>Dark</button> -->
    </div>
</nav>
<slot />
<style is:global>
    * {
        --background-light: white;
        --background-dark: #1a1a1a;
    }
    .navbtn {
        height: 20px;
        padding: 10px;
        border: 1px solid black;
        border-radius: 10px;
        transition: border-color 0.4s, background-color 0.4s;
        background-color: var(--background-light);
    }

    .navbtn:hover {
        background-color: var(--book-hover);
        cursor: pointer;
    }

    body.dark .navbtn:hover {
        background-color: var(--book-hover-dark);
    }

    
    body.dark .navbtn {
        border-color: white;
        background-color: var(--background-dark);
    }

    nav {
        height: 40px;
        margin-bottom: 9px;
        padding-bottom: 1px;
        padding-top: 5px;
        position: sticky;
        top: 0;
        /* background-color: white; */
        transition: background-color 0.4s;
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
        background-color: var(--background-light);
        color: #000;
    }

    body a {
        transition: color 0.4s;
    }

    body.dark {
        background-color: var(--background-dark);
        color: #fff;
    }

    body.dark a {
        color: #00cc99;
    }

    
</style>