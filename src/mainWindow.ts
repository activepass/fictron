import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import serve from "electron-serve";

const serveURL = serve({ directory: "." });
const isDev: Boolean = !app.isPackaged;
const port: string = process.env.PORT ? process.env.PORT.toString() : "5173";
export let mainWindow: BrowserWindow;

// Create the main browser window
function createMainWindow() {
	console.log(path.join(__dirname, "preload.js"));

	const mainWindow = new BrowserWindow({
		height: 600,
        width: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			devTools: true,
			nodeIntegration: true,
			contextIsolation: true,
			sandbox: true,
		},
        autoHideMenuBar: true,
	});

	return mainWindow;
}

// Load Vite to launch Svelte
function loadVite(port: string) {
	mainWindow.loadURL(`http://localhost:${port}`).catch((e) => {
		console.log("Error loading URL, retrying", e);
		setTimeout(() => {
			loadVite(port);
		}, 200);
	});
}

export function launchMainWindow() {
	mainWindow = createMainWindow();
	mainWindow.once("close", () => {
		mainWindow = null;
	});

	if (isDev) loadVite(port);
	else serveURL(mainWindow);
}