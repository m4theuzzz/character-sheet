require('newrelic');
require('dotenv').config();

const PORT = process.env.PORT ?? 80;

// const { app, BrowserWindow } = require('electron');
const express = require('express');
// const api = express();
const app = express();

// const createWindow = () => {
//     const win = new BrowserWindow({
//         minWidth: 420,
//         minHeight: 600,
//         width: 420,
//         height: 600,
//         frame: true,
//         autoHideMenuBar: true,
//         webPreferences: {
//             nodeIntegration: true
//         }
//     });

//     win.loadFile('./public/html/index.html');

//     // win.webContents.openDevTools();
// }

const startAPI = (api) => {
    api.use(express.json());

    const charactersRoute = require('./api/routes/CharactersRoute');
    const characterSheetRoute = require('./api/routes/CharacterSheetRoute');
    const itemsRoute = require('./api/routes/ItemsRoute');
    const spellsRoute = require('./api/routes/SpellsRoute');
    const usersRoute = require('./api/routes/UsersRoute');

    usersRoute(api);
    charactersRoute(api);
    characterSheetRoute(api);
    itemsRoute(api);
    spellsRoute(api);

    api.listen(PORT);
}

// app.whenReady().then(() => {
//     startAPI();
//     createWindow();

//     app.on('activate', function () {
//         if (BrowserWindow.getAllWindows().length === 0) createWindow();
//     });
// }).catch(appReadyErr => {
//     throw appReadyErr;
// });

// app.on('window-all-closed', function () {
//     if (process.platform !== 'darwin') app.quit();
// });

const path = require('path');

app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/html/index.html')))

startAPI(app);