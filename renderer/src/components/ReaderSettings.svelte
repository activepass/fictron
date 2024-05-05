<script lang='ts'>
	import { onMount } from "svelte";

    let content_wrapper: HTMLElement;

    let align: HTMLSelectElement;
    let font: HTMLSelectElement;

    function saveReaderSettings() {
        localStorage.setItem("reader_settings", JSON.stringify({
            alignment: align.value,
            font: font.value
        }));
    }

    function loadReaderSettings() {
        if (!content_wrapper) return;
        let settings = localStorage.getItem("reader_settings");
        if (settings) {
            let s = JSON.parse(settings);
            console.log(s.alignment, s.font)
            align.value = s.alignment;
            alignChange();
            font.value = s.font;
            fontChange();
        }
    }


    function alignChange() {
        console.log(content_wrapper.style)
        content_wrapper.style.textAlign = align.value;
        saveReaderSettings();
    }

    function fontChange() {
        content_wrapper.style.fontFamily = font.value;
        saveReaderSettings();
    }

    onMount(() => {
        content_wrapper = document.querySelector("div.content") as HTMLElement
        loadReaderSettings()
    });

    
</script>
<!-- TODO: SETTINGS SHOULD SAVE AND BE LOADED -->
<div class="reader_settings">
    <select name="alignment" id="alignment" on:change={alignChange} bind:this={align}>
        <option value="center">Center</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
    </select>
    <select name="font" id="font_select" on:change={fontChange} bind:this={font}>
        <option value="system-ui">System Font</option>
        <option value="serif">Serif</option>
        <option value="sans-serif">Sans-Serif</option>
    </select>
    <!-- TODO: FONT SCALE -->
    <!-- TODO: MARGIN -->
</div>