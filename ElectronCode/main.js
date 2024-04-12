const { app, BrowserWindow, screen, ipcMain, nativeTheme } = require('electron')
const path = require('path');

app.whenReady().then(() => {
    //retrieves the users display size
    const {width, height } = screen.getPrimaryDisplay().workAreaSize;

    //creates a window
    const myWindow = new BrowserWindow({
        //ensure the apps s
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true, // enable nodeIntegration
            contextIsolation: true, // enable contextIsolation
            preload: path.join(__dirname, 'preload.js') // specify the preload script
        }
    });

    //loads the webpage
    myWindow.loadFile('index.html');
}).catch(error => {
    // Handle the error here
    console.error('Error occurred:', error);
});

//will toggle the theme from light to dark
ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
});