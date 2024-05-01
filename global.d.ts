// Globally declared types used by both Electron and SvelteKit

import { Ao3FicDetail } from "./shared/Ao3";
import { FicContent, MinFicDetail } from "./shared/Fic";
// import { Ao3Fic } from "./shared/Ao3";

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	// The Window interface is where the preload script exposes its API to the renderer process.
	// Compare this to the contextBridge.exposeInMainWorld() call in src/preload.ts.
	interface Window {
        fictron?: {
            getAo3FicContent: (ficUrl: string) => Promise<FicContent>;
            getFFNetFicContent: (ficUrl: string) => Promise<FicContent>;
            addAo3FicToLibrary: (ficUrl: string) => Promise<number>;
            addFFNetFicToLibrary: (ficUrl: string) => Promise<number>;
            getMinFicDetail: (ficUrl: string) => Promise<MinFicDetail | null>;
            getAo3FicDetail: (ficUrl: string) => Promise<Ao3FicDetail | null>;
            getLibrary: () => Promise<MinFicDetail[]>;
        }
        versions?: Electron.IpcRenderer;
  }

	// This is where declarations for types you want to use in the main process and the renderer process go.
	type ProcessVersions = NodeJS.ProcessVersions;
}

export {};
