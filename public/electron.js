const {app, dialog, BrowserWindow, Menu} = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');

const IS_DEV = process.env.NODE_ENV === 'development';

let mainWindow;

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open...',
        accelerator: 'CmdOrCtrl+O',
        click() { openFile(); },
      },
      {
        label: 'Save...',
        accelerator: 'CmdOrCtrl+S',
        click() { mainWindow.webContents.send('save'); },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall',
      },
    ],
  },
  {
    label: 'Developer',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ?
            'Alt+Command+I' : 'Ctrl+Shift+I',
        click() { mainWindow.webContents.toggleDevTools(); },
      },
    ],
  },
];

if (process.platform === 'darwin') {
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about',
      },
      {
        type: 'separator',
      },
      {
        label: 'Services',
        role: 'services',
        submenu: [],
      },
      {
        type: 'separator',
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide',
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers',
      },
      {
        label: 'Show All',
        role: 'unhide',
      },
      {
        type: 'separator',
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); },
      },
    ],
  });
}

function openFile() {
  const filePaths = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      {name: 'JSON', extensions: ['json']},
    ],
  });

  if (!filePaths) return;
  const filePath = filePaths[0];
  const data = fs.readFileSync(filePath, {encoding: 'utf8'}).toString();

  mainWindow.webContents.send('open', filePath, data);
}

function createWindow() {
  // create browser window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true, // make require available for render
    },
    width: 800, height: 600,
  });

  // menu config
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  app.setAboutPanelOptions({
    applicationName: 'CViewer',
    applicationVersion: '0.0.1',
  });

  const staticIndexPath = path.join(__dirname, './public/index.html');
  const main = IS_DEV ? `http://localhost:3000` : url.format({
    pathname: staticIndexPath,
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(main);

  mainWindow.on('closed', () => { mainWindow = null; });
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