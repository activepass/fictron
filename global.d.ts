// Globally declared types used by both Electron and SvelteKit

import { Ao3Fic, FicContent } from "./shared/Fic";

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
            getFicContent: (ficUrl: string) => Promise<FicContent>;
            getFFNetFicContent: (ficUrl: string) => Promise<FicContent>;
            getAo3FicMetadata: (ficUrl: string) => Promise<Ao3Fic>;
        }
        versions?: Electron.IpcRenderer;
  }

	// This is where declarations for types you want to use in the main process and the renderer process go.
	type ProcessVersions = NodeJS.ProcessVersions;
}

export {};
