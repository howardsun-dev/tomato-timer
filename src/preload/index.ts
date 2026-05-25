import { contextBridge, ipcRenderer } from 'electron'

const timerApi = {
  closeWindow: (): void => ipcRenderer.send('close-window'),
  minimizeWindow: (): void => ipcRenderer.send('minimize-window'),
  onOverlayMode: (callback: (isOverlayOn: boolean) => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, isOverlayOn: boolean): void => {
      callback(isOverlayOn)
    }

    ipcRenderer.on('overlay-mode', listener)

    return () => {
      ipcRenderer.removeListener('overlay-mode', listener)
    }
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('timerApi', timerApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore - fallback for non-isolated development contexts
  window.timerApi = timerApi
}
