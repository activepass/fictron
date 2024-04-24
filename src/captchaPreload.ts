import { ipcRenderer } from "electron"
import { IpcEvents } from "./IpcEvents";
import { FicContent } from "../shared/Fic";

function checkReturnCaptchaState() {
    console.log("Checking Captcha")
    let x = document.querySelector('b.xcontrast_txt');
    if (x) {
        console.log("Captcha Done")
        let content = document.querySelector("[role='main']");
        let Fic = {title: x.textContent, content: content.innerHTML} satisfies FicContent as FicContent;
        let nav_btns = document.querySelectorAll("#content_wrapper_inner > span:nth-child(7) > button");

        let ffurl = "https://www.fanfiction.net";
        nav_btns.forEach(element => {
            if (element.textContent == "Next >") {
                Fic.next = ffurl + element.getAttribute("onclick").split("'")[1];
            } else if (element.textContent == "< Prev") {
                Fic.previous = ffurl + element.getAttribute("onclick").split("'")[1];
            }
        });

        ipcRenderer.send(IpcEvents.FT_CAPTCHA_SOLVED, Fic);
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
    ipcRenderer.send(IpcEvents.FT_CAPTCHA_SHOW_WINDOW)

    setInterval(() => {
        checkReturnCaptchaState();
    });
})
