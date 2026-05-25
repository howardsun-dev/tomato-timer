import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 380,
    height: 240,
    show: false,
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  const toggleOverlayHotKey = 'CommandOrControl+6'
  let isOverlayOn = false

  const registered = globalShortcut.register(toggleOverlayHotKey, () => {
    isOverlayOn = !isOverlayOn
    mainWindow.setIgnoreMouseEvents(isOverlayOn)

    mainWindow.webContents.send('overlay-mode', isOverlayOn)
  })

  if (!registered) {
    console.warn(`Failed to register global shortcut: ${toggleOverlayHotKey}`)
  }

  mainWindow.on('closed', () => {
    globalShortcut.unregister(toggleOverlayHotKey)
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setAlwaysOnTop(true, 'normal') // Ensure this is called after the window is ready to show
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    try {
      const targetUrl = new URL(details.url)

      if (targetUrl.protocol === 'https:' || targetUrl.protocol === 'http:') {
        void shell.openExternal(targetUrl.toString())
      }
    } catch (error) {
      console.warn(`Blocked invalid external URL: ${details.url}`, error)
    }

    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('dev.howardsun.timer')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('close-window', (): void => {
    console.log('Close window event received')
    const currentWindow = BrowserWindow.getFocusedWindow()

    if (currentWindow) {
      currentWindow.close()
    }
  })

  ipcMain.on('minimize-window', (): void => {
    console.log('Minimize window event received')
    const currentWindow = BrowserWindow.getFocusedWindow()

    if (currentWindow) {
      currentWindow.minimize()
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
