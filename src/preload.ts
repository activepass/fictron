// preload.ts

// From Electron 20 onwards, preload scripts are sandboxed by default
// and no longer have access to a full Node.js environment. Practically,
// this means that you have a polyfilled require function that only
// has access to a limited set of APIs.
// Read more: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

import { contextBridge, ipcRenderer } from "electron";
import { IpcEvents } from "./IpcEvents";

contextBridge.exposeInMainWorld("fictron", {
    getFicContent: async (ficUrl: string) => {
        return await ipcRenderer.invoke(IpcEvents.FT_GET_FIC_CONTENT, ficUrl);
    },
    getFFNetFicContent: async (ficUrl: string) => {
        return await ipcRenderer.invoke(IpcEvents.FT_GET_FFNET_FIC_CONTENT, ficUrl);
    }
})

// we can also expose variables, not just functions
contextBridge.exposeInMainWorld("versions", {
	chrome: () => process.versions.chrome,
	electron: () => process.versions.electron,
	node: () => process.versions.node,
});
