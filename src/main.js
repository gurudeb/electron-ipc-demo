const electron = require("electron");
const path = require("path");

const countdown = require("./countdown");

const ipc = electron.ipcMain;
const { app, BrowserWindow, Tray, Menu } = electron; // de-structure

const windows = [];

app.on("ready", _ => {
    const tray = new Tray(path.join('src', 'alien.png'));
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
    const name = electron.app.getName();
    const template = [
        {
            label: name,
            submenu: [{
                label: `About ${name}`,
                click: _ => {
                    console.log('clicked about')
                },
                accelerator: "Ctrl+B",
                role: "about"
            }, {
                type: "separator"
            }, {
                label: "Quit",
                click: _ => {
                    app.quit();
                },
                accelerator: "Ctrl+Q"
            }]
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Wow",
            click: _ => console.log("wow")
        },
        {
            label: "Awesome",
            click: _ => console.log("awesome")
        }
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip("Alien Attack Counter");
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
