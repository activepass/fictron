import { ipcRenderer } from "electron"
import { IpcEvents } from "./IpcEvents";

function checkReturnCaptchaState() {
    console.log("Checking Captcha")
    const x = document.querySelector('.main-content');
    if (!x) {
        console.log("Captcha Done")
        ipcRenderer.send(IpcEvents.CAPTCHA_SOLVED, document.documentElement.outerHTML);
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
    ipcRenderer.send(IpcEvents.CAPTCHA_SHOW_WINDOW)

    setInterval(() => {
        checkReturnCaptchaState();
    });
})
