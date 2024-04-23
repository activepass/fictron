import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import serve = require("electron-serve");
import { IpcEvents } from "./IpcEvents";
import { launchMainWindow, mainWindow } from "./mainWindow";



async function sendProcessVersionsToRender() {
	const processVersions: ProcessVersions = process.versions;
	console.log("sending processVersions to IPC to pass on to renderer");
	return processVersions;
	// mainWindow.webContents.send('system:sendProcessVersions', processVersions);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	launchMainWindow();

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) launchMainWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.once("ready", () => {
	ipcMain.handle(IpcEvents.FT_REQUEST_VERSIONS, (event) => {
		console.log("Renderer is asking for process versions");
        mainWindow.webContents.openDevTools();
		const versionsToSend = sendProcessVersionsToRender();
		return versionsToSend;
	});
});
