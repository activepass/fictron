import { ipcRenderer } from "electron"
import { IpcEvents } from "./IpcEvents";

function checkReturnCaptchaState() {
    console.log("Checking Captcha")
    let x = document.querySelector('b.xcontrast_txt');
    if (x) {
        console.log("Captcha Done")
        ipcRenderer.send(IpcEvents.FT_CAPTCHA_SOLVED, x.textContent);
        return true;
    } else {
        console.log("Captcha")
        return false;
    }
}

addEventListener('DOMContentLoaded', () => {
    console.log("Captcha Preload Loaded");
    if (checkReturnCaptchaState()) {
        return;
    }

    setInterval(() => {
        checkReturnCaptchaState();
    });
})
