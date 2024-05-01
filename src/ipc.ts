import { IpcEvents } from "./IpcEvents";
import 'isomorphic-fetch';
import { BrowserWindow, ipcMain } from 'electron';
import { FicContent, MinFicDetail, } from "../shared/Fic";
import { Ao3FicDetail, Ao3Source } from "../shared/Ao3";
import { FfnSource } from "../shared/Ffn";
import path from "path";
import {Ao3FicAlreadyExists, addAo3Fic, getAo3FicDetail, getLibrary, getMinFic } from "../shared/Library"

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
            return new Ao3Source().pageToContent(content);
        })
        .catch(err => {
            console.log(err)
            return {title: "Failed", content: "", chapter: -1}
        });
});

ipcMain.handle(IpcEvents.GET_FFNET_FIC_CONTENT, (event, ficUrl): Promise<FicContent> => {
    const start_time = Date.now();
    const captcha_window = new BrowserWindow({width: 800, height: 600, show: false, webPreferences: {
        preload: path.join(__dirname, "captchaPreload.js"),
    }});
    captcha_window.loadURL(ficUrl);

    ipcMain.once(IpcEvents.CAPTCHA_SHOW_WINDOW, () => {
        captcha_window.show();
    });

    return new Promise((resolve) => {
        ipcMain.once(IpcEvents.CAPTCHA_SOLVED, (event, html) => {
            console.log(`Time taken to get fic: ${Date.now() - start_time}ms`);
            const content = new FfnSource().pageToContent(html);
            resolve(content);
            captcha_window.close();
        });
    });
});

ipcMain.handle(IpcEvents.ADD_AO3_FIC_TO_LIBRARY, (event, ficUrl): Promise<number> => {
    return fetch(ficUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(function(content) {
            const metadata = new Ao3Source().getFic(content, ficUrl);
            // eslint-disable-next-line prefer-const
            let [exists, library_id] = Ao3FicAlreadyExists(ficUrl);
            if (exists) {
                console.log("Fic already exists in library");
                return library_id;
            }
            library_id = addAo3Fic(metadata);
            
            return library_id;
        })
        .catch(err => {
            console.log(err)
            return -1;
        });
});

ipcMain.handle(IpcEvents.GET_MIN_FIC, (event, library_id): MinFicDetail | null => {
    return getMinFic(library_id);
});

ipcMain.handle(IpcEvents.GET_AO3_FIC, (event, library_id): Ao3FicDetail | null => {
    return getAo3FicDetail(library_id);
});

ipcMain.handle(IpcEvents.GET_LIBRARY, (): MinFicDetail[] => {
    return getLibrary();
});