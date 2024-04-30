<script lang='ts'>
	import { onMount } from "svelte";

    export let content_wrapper: HTMLElement;

    let dark_mode_button: HTMLButtonElement;
    let dark_mode = false;

    function alignChange(e: Event) {
        let select = e.target as HTMLSelectElement;
        content_wrapper.style.textAlign = select.value;
    }

    function fontChange(e: Event) {
        let select = e.target as HTMLSelectElement;
        content_wrapper.style.fontFamily = select.value;
    }

    function colourModeChanged() {
        dark_mode = !dark_mode;
        if (dark_mode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        dark_mode_button.innerText = dark_mode ? "Light" : "Dark";
    }

    
</script>
<!-- TODO: SETTINGS SHOULD SAVE AND BE LOADED -->

<!-- TODO: MAKE THIS AN ACTUAL TOOLBAR -->
<div class="reader_settings">
    <select name="alignment" id="alignment" on:change={alignChange}>
        <option value="center">Center</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
    </select>
    <select name="font" id="font_select" on:change={fontChange}>
        <option value="system-ui">System</option>
        <option value="serif">serif</option>
        <option value="sans-serif">Sans-serif</option>
    </select>
    <!-- TODO: FONT SCALE -->
    <!-- TODO: MARGIN -->
    <button bind:this={dark_mode_button} on:click={colourModeChanged}>Dark</button>
</div>