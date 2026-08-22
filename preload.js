const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})

contextBridge.exposeInMainWorld('drawingFiles', {
  save: (document) => ipcRenderer.invoke('drawing-file:save', document),
  open: () => ipcRenderer.invoke('drawing-file:open'),
  confirmOpen: (pendingOpenId) => ipcRenderer.invoke('drawing-file:confirm-open', pendingOpenId),
  clearCurrent: () => ipcRenderer.invoke('drawing-file:clear-current')
})
