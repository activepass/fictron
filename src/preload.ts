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
})

// we can also expose variables, not just functions
contextBridge.exposeInMainWorld("versions", {
	chrome: () => process.versions.chrome,
	electron: () => process.versions.electron,
	node: () => process.versions.node,
});
