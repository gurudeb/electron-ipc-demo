const electron = require("electron");

const countdown = require("./countdown");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const Menu = electron.Menu;

const windows = [];

app.on("ready", _ => {
    [1, 2, 3].forEach( _ => {
        let win = new BrowserWindow({
            height: 400,
            width: 400
        });

        win.loadURL(`file://${__dirname}/countdown.html`);

        win.on("closed", _ => {
            mainWindow = null;
        });

        windows.push(win);
    });
    const template = [
        {
            label: electron.app.getName()
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});

ipc.on("countdown-start", _ => {
    countdown(count => {
        console.log("count", count);
        windows.forEach(win => {
          // webContents is an event emitter instance
          win.webContents.send("countdown", count);
        })
    });
});
