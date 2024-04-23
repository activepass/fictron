import { IpcEvents } from "./IpcEvents";
import { load } from 'cheerio';
import 'isomorphic-fetch';
import { ipcMain } from 'electron';

ipcMain.handle(IpcEvents.FT_GET_FIC_CONTENT, (event, ficUrl) => {
    console.log(ficUrl);
    return fetch(ficUrl)
        .then(function (response) {
            console.log("got response")
            if (!response.ok) {
                console.log("eat shit");
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        
        })
        .then(function(content) {
            console.log("got content")
            const $ = load(content);
            const title = $("[role='article']").html();

            return title;
        })
        .catch(err => {
            console.log(err)
            return "Failed to load"
        });
});