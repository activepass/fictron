import { IpcEvents } from "./IpcEvents";
import { load } from 'cheerio';
import 'isomorphic-fetch';
import { BrowserWindow, ipcMain } from 'electron';
import { FicContent } from "../shared/Fic";
import path from "path";

const ao3_url = "https://archiveofourown.org";

ipcMain.handle(IpcEvents.FT_GET_FIC_CONTENT, (event, ficUrl): Promise<FicContent> => {
    console.log(ficUrl);
    return fetch(ficUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        
        })
        .then(function(content) {
            const start_time = Date.now();
            const $ = load(content);
            const ficcontent = $("[role='article']").html();
            const title = $(".title").first().text();
            if (title.length <= 0 ) {
                console.log("Locked Fic", $("body").html())
                return {title: "Locked Fic", content: "you have to be logged in to access this"}
            }

            const next = $(".chapter.next").children().first().attr("href");
            const previous = $(".chapter.previous").children().first().attr("href");

            console.log(`Time taken to parse fic: ${Date.now() - start_time}ms`);
            return {title: title, content: ficcontent, ...(next && next.length > 0 ? {next: ao3_url + next} : {}), ...(previous && previous.length > 0 ? {previous: ao3_url + previous} : {})};
        })
        .catch(err => {
            console.log(err)
            return {title: "Failed", content: ""}
        });
});

ipcMain.handle(IpcEvents.FT_GET_FFNET_FIC_CONTENT, (event, ficUrl): Promise<FicContent> => {
    console.log("CREATING WINDOW")
    const captcha_window = new BrowserWindow({width: 800, height: 600, show: false, webPreferences: {
        preload: path.join(__dirname, "captchaPreload.js"),
    }});
    captcha_window.loadURL(ficUrl);

    ipcMain.once(IpcEvents.FT_CAPTCHA_SHOW_WINDOW, (event) => {
        console.log("SHOWING CAPTCHA")
        captcha_window.show();
    });

    return new Promise((resolve, reject) => {
        ipcMain.once(IpcEvents.FT_CAPTCHA_SOLVED, (event, content) => {
            console.log("CAPTCHA SOLVED")

            resolve(content);
            captcha_window.close();
        });
    });
});

