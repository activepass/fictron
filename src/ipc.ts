import { IpcEvents } from "./IpcEvents";
import "isomorphic-fetch";
import { BrowserWindow, ipcMain } from "electron";
import { FicContent, MinFicDetail } from "../shared/Fic";
import { Ao3FicDetail, Ao3Source } from "../shared/Ao3";
import { FfnSource, FfnetFicDetail } from "../shared/Ffn";
import path from "path";
import {
	Ao3FicAlreadyExists,
	FfnFicAlreadyExists,
	addAo3Fic,
	addFfnFic,
	ao3Chapter,
	ffnChapter,
	getAo3FicDetail,
	getFfnFicDetail,
	getLibrary,
	getLibraryRecent,
	getMinFic,
	linkAo3Fic,
	linkFfnFic,
	updateAo3Fic,
	updateFfnFic,
} from "../shared/Library";

ipcMain.handle(
	IpcEvents.GET_AO3_FIC_CONTENT,
	(event, ficUrl): Promise<FicContent> => {
		console.log(ficUrl);
		return fetch(ficUrl)
			.then(function (response) {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.text();
			})
			.then(function (content) {
				return new Ao3Source().pageToContent(content);
			})
			.catch((err) => {
				console.log(err);
				return { title: "Failed", content: "", chapter: -1 };
			});
	}
);

ipcMain.handle(
	IpcEvents.GET_FFNET_FIC_CONTENT,
	(event, ficUrl): Promise<FicContent> => {
		const start_time = Date.now();
		const captcha_window = new BrowserWindow({
			width: 800,
			height: 600,
			show: false,
			webPreferences: {
				preload: path.join(__dirname, "captchaPreload.js"),
			},
		});
		captcha_window.loadURL(ficUrl);

		ipcMain.once(IpcEvents.CAPTCHA_SHOW_WINDOW, () => {
			captcha_window.show();
		});

		return new Promise((resolve) => {
			ipcMain.once(IpcEvents.CAPTCHA_SOLVED, (event, html) => {
				console.log(
					`Time taken to get fic: ${Date.now() - start_time}ms`
				);
				const content = new FfnSource().pageToContent(html);
				resolve(content);
				captcha_window.close();
			});
		});
	}
);

ipcMain.handle(
	IpcEvents.ADD_AO3_FIC_TO_LIBRARY,
	(event, ficUrl): Promise<number> => {
		return fetch(ficUrl)
			.then(function (response) {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.text();
			})
			.then(function (content) {
                try {
                    const metadata = new Ao3Source().getFic(content, ficUrl);
                    // eslint-disable-next-line prefer-const
                    let [exists, library_id] = Ao3FicAlreadyExists(ficUrl);
                    if (exists) {
                        console.log("updating fic");
                        updateAo3Fic(library_id, metadata);
                        return library_id;
                    }
                    library_id = addAo3Fic(metadata);
                    
                    return library_id;
                } catch (e) {
                    console.error(e);
                    return -1;
                }
			})
			.catch((err) => {
				console.log(err);
				return -1;
			});
	}
);

ipcMain.handle(
	IpcEvents.GET_MIN_FIC,
	(event, library_id): MinFicDetail | null => {
		return getMinFic(library_id);
	}
);

ipcMain.handle(
	IpcEvents.GET_AO3_FIC,
	(event, library_id): Ao3FicDetail | null => {
		return getAo3FicDetail(library_id);
	}
);

ipcMain.handle(IpcEvents.GET_LIBRARY, (): MinFicDetail[] => {
	return getLibrary();
});

ipcMain.handle(IpcEvents.GET_LIBRARY_RECENT, (): MinFicDetail[] => {
    return getLibraryRecent();
});

ipcMain.handle(
	IpcEvents.GET_AO3_FIC_URL,
	(event, library_id, chapter): Promise<string> => {
		return new Ao3Source().getUrlForChapter(library_id, chapter);
	}
);

ipcMain.handle(IpcEvents.GET_FFNET_FIC, (event, library_id): FfnetFicDetail => {
	return getFfnFicDetail(library_id);
});

ipcMain.handle(
	IpcEvents.ADD_FFNET_FIC_TO_LIBRARY,
	(event, ficUrl): Promise<number> => {
		const start_time = Date.now();
		const captcha_window = new BrowserWindow({
			width: 800,
			height: 600,
			show: false,
			webPreferences: {
				preload: path.join(__dirname, "captchaPreload.js"),
			},
		});
		captcha_window.loadURL(ficUrl);

		ipcMain.once(IpcEvents.CAPTCHA_SHOW_WINDOW, () => {
			captcha_window.show();
		});

		return new Promise((resolve) => {
			ipcMain.once(IpcEvents.CAPTCHA_SOLVED, (event, html) => {
				console.log(
					`Time taken to get fic: ${Date.now() - start_time}ms`
				);
                try {
                    const content = new FfnSource().getFic(html, ficUrl);
                    // eslint-disable-next-line prefer-const
                    let [exists, library_id] = FfnFicAlreadyExists(ficUrl);
                    if (exists) {
                        console.log("updating fic");
                        updateFfnFic(library_id, content);
                        resolve(library_id);
                        captcha_window.close();
                        return;
                    }
                    library_id = addFfnFic(content);
    
                    resolve(library_id);
                    captcha_window.close();
                } catch (e) {
                    console.error(e);
                    resolve(-1);
                }
			});
		});
	}
);

ipcMain.handle(
	IpcEvents.GET_FFNET_FIC_URL,
	(event, library_id, chapter): Promise<string> => {
		return new FfnSource().getUrlForChapter(library_id, chapter);
	}
);

ipcMain.handle(
	IpcEvents.LINK_AO3_FIC,
	(event, library_id, ficUrl): Promise<number> => {
		return fetch(ficUrl)
			.then(function (response) {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.text();
			})
			.then(function (content) {
				const metadata = new Ao3Source().getFic(content, ficUrl);
				// eslint-disable-next-line prefer-const
				let [exists, existinglibid] = Ao3FicAlreadyExists(ficUrl);
				if (exists) {
					console.log(
						"Fic exists and is linked to library_id: ",
						existinglibid
					);
					return -1;
				}
				console.log("Linking fic to library_id: ", library_id);
				let success = linkAo3Fic(library_id, metadata);

				return library_id;
			})
			.catch((err) => {
				console.log(err);
				return -1;
			});
	}
);

ipcMain.handle(
	IpcEvents.LINK_FFNET_FIC,
	(event, library_id, ficUrl): Promise<number> => {
		const start_time = Date.now();
		const captcha_window = new BrowserWindow({
			width: 800,
			height: 600,
			show: false,
			webPreferences: {
				preload: path.join(__dirname, "captchaPreload.js"),
			},
		});
		captcha_window.loadURL(ficUrl);

		ipcMain.once(IpcEvents.CAPTCHA_SHOW_WINDOW, () => {
			captcha_window.show();
		});

		return new Promise((resolve) => {
			ipcMain.once(IpcEvents.CAPTCHA_SOLVED, (event, html) => {
				console.log(
					`Time taken to get fic: ${Date.now() - start_time}ms`
				);
				const content = new FfnSource().getFic(html, ficUrl);
				// eslint-disable-next-line prefer-const
				let [exists, existinglibid] = FfnFicAlreadyExists(ficUrl);
				if (exists) {
					console.log(
						"Fic exists and is linked to library_id: ",
						existinglibid
					);
					resolve(-1);
                    captcha_window.close();
                    return;
				}
				console.log("Linking fic to library_id: ", library_id);
				let success = linkFfnFic(library_id, content);
                resolve(library_id);
				captcha_window.close();
			});
		});
	}
);

ipcMain.on(IpcEvents.CHAPTER_AO3, (event, library_id, chapter) => {
	ao3Chapter(library_id, chapter);
});

ipcMain.on(IpcEvents.CHAPTER_FFNET, (event, library_id, chapter) => {
    ffnChapter(library_id, chapter);
});

