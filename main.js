const { app, BrowserWindow } = require('electron');
const express = require('express');

const PORT = 37456;

const createWindow = () => {
    const win = new BrowserWindow({
        minWidth: 420,
        minHeight: 600,
        width: 420,
        height: 600,
        frame: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('./public/html/index.html');

    // win.webContents.openDevTools();
}

const startAPI = () => {
    const charactersRoute = require('./api/routes/CharactersRoute');
    const characterSheetRoute = require('./api/routes/CharacterSheetRoute');
    const itemsRoute = require('./api/routes/ItemsRoute');
    const spellsRoute = require('./api/routes/SpellsRoute');

    const api = express();

    api.use(express.json())

    charactersRoute(api);
    characterSheetRoute(api);
    itemsRoute(api);
    spellsRoute(api);

    api.listen(PORT);
}

app.whenReady().then(() => {
    startAPI();
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
}).catch(appReadyErr => {
    throw appReadyErr;
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});