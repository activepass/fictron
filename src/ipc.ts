import { IpcEvents } from "./IpcEvents";
import 'isomorphic-fetch';
import { load } from 'cheerio';
import { BrowserWindow, ipcMain } from 'electron';
import { Ao3Fic, Ao3Rating, FicContent } from "../shared/Fic";
import path from "path";

const ao3_url = "https://archiveofourown.org";

ipcMain.handle(IpcEvents.GET_AO3_FIC_CONTENT, (event, ficUrl): Promise<FicContent> => {
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
                const locked = $("#signin")
                if (!locked) {
                    console.log("wacky error", $("body").html())
                    return {title: "Failed wacky", content: "", chapter: -1}
                }
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

ipcMain.handle(IpcEvents.GET_FFNET_FIC_CONTENT, (event, ficUrl): Promise<FicContent> => {
    console.log("CREATING WINDOW")
    const start_time = Date.now();
    const captcha_window = new BrowserWindow({width: 800, height: 600, show: true, webPreferences: {
        preload: path.join(__dirname, "captchaPreload.js"),
    }});
    captcha_window.loadURL(ficUrl);

    ipcMain.once(IpcEvents.CAPTCHA_SHOW_WINDOW, () => {
        captcha_window.show();
    });

    return new Promise((resolve) => {
        ipcMain.once(IpcEvents.CAPTCHA_SOLVED, (event, content) => {
            console.log(`Time taken to get fic: ${Date.now() - start_time}ms`);

            resolve(content);
            captcha_window.close();
        });
    });
});

ipcMain.handle(IpcEvents.GET_AO3_FIC_METADATA, (event, ficUrl): Promise<Ao3Fic> => {
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
            const title = $(".title").first().text().trim();
            const author_a = $(".byline a");
            const author = author_a.text();
            const author_link = ao3_url + author_a.attr("href");
            const published = $("dd.published").text();
            const updated = $("dd.status").text();
            const language = $("dd.language").text().trim();
            const words = +$("dd.words").text().replace(/,/g, '');
            const chapters = +$("dd.chapters").text().replace(/,/g, '').split("/")[0];
            const fandoms = $(".fandom a").map((_, elem) => $(elem).text()).get();
            const rating = $("dd.rating").text().trim() as Ao3Rating;
            const comments = +$("dd.comments").text().replace(/,/g, '');
            const kudos = +$("dd.kudos").text().replace(/,/g, '');
            const bookmarks = +$("dd.bookmarks").text().replace(/,/g, '');
            const hits = +$("dd.hits").text().replace(/,/g, '');

            console.log(`Time taken to parse fic meta: ${Date.now() - start_time}ms`);
            return {title, words, chapters, author, author_link, published, updated, language, fandoms, rating, comments, kudos, bookmarks, hits} satisfies Ao3Fic;

        })
        .catch(err => {
            console.log(err)
            return {title: "Failed", words: 0, chapters: 0, author: "", author_link: "", published: "", updated: "", language: "", fandoms: [], rating: "Not Rated", comments: 0, kudos: 0, bookmarks: 0, hits: 0}
        });
});
