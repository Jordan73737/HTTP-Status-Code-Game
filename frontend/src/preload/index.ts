import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  quitApp: (): void => { ipcRenderer.send('quit-app') },
})
