const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    // create browser window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true // make require available for render
        },
        width: 800, height: 600
    });

    // load index.html of the app
    const pkg = { DEV: true };

    // check if in the dev mode
    if (pkg.DEV) {
        mainWindow.loadURL('http://localhost:3000/');
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, './build/index.html'),
            protocol: 'file:',
            slashes: true,
        }));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
});