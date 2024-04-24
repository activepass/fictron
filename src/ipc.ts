import { IpcEvents } from "./IpcEvents";
import 'isomorphic-fetch';
import { load } from 'cheerio';
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
                return {title: "Locked Fic", content: "you have to be logged in to access this", chapter: -1}
            }
            const chapter = $(".chapter.preface .title a").text();

            const next = $(".chapter.next").children().first().attr("href");
            const previous = $(".chapter.previous").children().first().attr("href");

            console.log(`Time taken to parse fic: ${Date.now() - start_time}ms`);
            return {
                title: title,
                content: ficcontent,
                ...(chapter ? {chapter: +chapter.substring("Chapter ".length)} : {chapter: 0}),
                ...(next && next.length > 0 ? {next: ao3_url + next} : {}),
                ...(previous && previous.length > 0 ? {previous: ao3_url + previous} : {})
            } satisfies FicContent;
        })
        .catch(err => {
            console.log(err)
            return {title: "Failed", content: "", chapter: -1}
        });
});

ipcMain.handle(IpcEvents.FT_GET_FFNET_FIC_CONTENT, (event, ficUrl): Promise<FicContent> => {
    console.log("CREATING WINDOW")
    const captcha_window = new BrowserWindow({width: 800, height: 600, show: false, webPreferences: {
        preload: path.join(__dirname, "captchaPreload.js"),
    }});
    captcha_window.loadURL(ficUrl);

    ipcMain.once(IpcEvents.FT_CAPTCHA_SHOW_WINDOW, () => {
        console.log("SHOWING CAPTCHA")
        captcha_window.show();
    });

    return new Promise((resolve) => {
        ipcMain.once(IpcEvents.FT_CAPTCHA_SOLVED, (event, content) => {
            console.log("CAPTCHA SOLVED")

            resolve(content);
            captcha_window.close();
        });
    });
});

