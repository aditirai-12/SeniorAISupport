const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('node:path')

//function to create a new browser window of size 800 pixels x 600 pixels
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
  })

  win.loadFile('index.html')
}

//implementing a dark mode setting on web app
ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })
  
  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
  

//calls createWindow() to display window when application is started
app.whenReady().then(() => {
    createWindow()
})

//(windows and linux) app quits when all windows are closed 
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

  