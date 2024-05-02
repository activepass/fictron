// preload.ts

// From Electron 20 onwards, preload scripts are sandboxed by default
// and no longer have access to a full Node.js environment. Practically,
// this means that you have a polyfilled require function that only
// has access to a limited set of APIs.
// Read more: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

import { contextBridge, ipcRenderer } from "electron";
import { IpcEvents } from "./IpcEvents";

contextBridge.exposeInMainWorld("fictron", {
    getAo3FicContent: async (ficUrl: string) => {
        return await ipcRenderer.invoke(IpcEvents.GET_AO3_FIC_CONTENT, ficUrl);
    },
    getFFNetFicContent: async (ficUrl: string) => {
        return await ipcRenderer.invoke(IpcEvents.GET_FFNET_FIC_CONTENT, ficUrl);
    },
    addAo3FicToLibrary: async (ficUrl: string) => {
        return await ipcRenderer.invoke(IpcEvents.ADD_AO3_FIC_TO_LIBRARY, ficUrl);
    },
    getMinFicDetail: (library_id: number) => {
        return ipcRenderer.invoke(IpcEvents.GET_MIN_FIC, library_id);
    },
    getAo3FicDetail: (library_id: number) => {
        return ipcRenderer.invoke(IpcEvents.GET_AO3_FIC, library_id);
    },
    getLibrary: () => {
        return ipcRenderer.invoke(IpcEvents.GET_LIBRARY);
    },
    getLibraryRecent: () => {
        return ipcRenderer.invoke(IpcEvents.GET_LIBRARY_RECENT);
    },
    getAo3FicUrl: (library_id: number, chapter: number) => {
        return ipcRenderer.invoke(IpcEvents.GET_AO3_FIC_URL, library_id, chapter);
    },
    getFfnFicDetail: (library_id: number) => {
        return ipcRenderer.invoke(IpcEvents.GET_FFNET_FIC, library_id);
    },
    addFFNetFicToLibrary: async (ficUrl: string) => {
        return await ipcRenderer.invoke(IpcEvents.ADD_FFNET_FIC_TO_LIBRARY, ficUrl);
    },
    getFfnFicUrl: (library_id: number, chapter: number) => {
        return ipcRenderer.invoke(IpcEvents.GET_FFNET_FIC_URL, library_id, chapter);
    },
    linkAo3Fic: (library_id: number, ficUrl: string) => {
        return ipcRenderer.invoke(IpcEvents.LINK_AO3_FIC, library_id, ficUrl);
    },
    linkFfnFic: (library_id: number, ficUrl: string) => {
        return ipcRenderer.invoke(IpcEvents.LINK_FFNET_FIC, library_id, ficUrl);
    },
    chapterAo3: (library_id: number, chapter: number) => {
        ipcRenderer.send(IpcEvents.CHAPTER_AO3, library_id, chapter);
    },
    chapterFfn: (library_id: number, chapter: number) => {
        ipcRenderer.send(IpcEvents.CHAPTER_FFNET, library_id, chapter);
    },

})

// we can also expose variables, not just functions
contextBridge.exposeInMainWorld("versions", {
	chrome: () => process.versions.chrome,
	electron: () => process.versions.electron,
	node: () => process.versions.node,
});
