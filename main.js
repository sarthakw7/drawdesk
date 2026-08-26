const { app, BrowserWindow, dialog, ipcMain } = require('electron/main')
const fs = require('node:fs/promises')
const path = require('node:path')

const drawingFileFilters = [
  {
    name: 'Drawdesk Drawing',
    extensions: ['drawdesk']
  }
]

let currentDrawingFilePath = null
let pendingOpen = null

const registerDrawingFileHandlers = () => {
  ipcMain.handle('drawing-file:save', async (_event, document) => {
    if (currentDrawingFilePath) {
      await fs.writeFile(currentDrawingFilePath, `${JSON.stringify(document, null, 2)}\n`, 'utf8')

      return {
        status: 'saved',
        fileName: path.basename(currentDrawingFilePath)
      }
    }

    const result = await dialog.showSaveDialog({
      filters: drawingFileFilters,
      defaultPath: 'Untitled.drawdesk'
    })

    if (result.canceled || !result.filePath) {
      return {
        status: 'cancelled'
      }
    }

    await fs.writeFile(result.filePath, `${JSON.stringify(document, null, 2)}\n`, 'utf8')
    currentDrawingFilePath = result.filePath

    return {
      status: 'saved',
      fileName: path.basename(currentDrawingFilePath)
    }
  })

  ipcMain.handle('drawing-file:open', async () => {
    pendingOpen = null

    const result = await dialog.showOpenDialog({
      filters: drawingFileFilters,
      properties: ['openFile']
    })

    if (result.canceled || result.filePaths.length === 0) {
      return {
        status: 'cancelled'
      }
    }

    try {
      const contents = await fs.readFile(result.filePaths[0], 'utf8')
      const document = JSON.parse(contents)
      pendingOpen = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        filePath: result.filePaths[0]
      }

      return {
        status: 'opened',
        pendingOpenId: pendingOpen.id,
        fileName: path.basename(pendingOpen.filePath),
        document
      }
    } catch {
      return {
        status: 'error',
        message: 'Unable to read this drawing file.'
      }
    }
  })

  ipcMain.handle('drawing-file:confirm-open', (_event, pendingOpenId) => {
    if (!pendingOpen || pendingOpen.id !== pendingOpenId) {
      return {
        status: 'ignored'
      }
    }

    currentDrawingFilePath = pendingOpen.filePath
    pendingOpen = null

    return {
      status: 'confirmed',
      fileName: path.basename(currentDrawingFilePath)
    }
  })

  ipcMain.handle('drawing-file:clear-current', () => {
    currentDrawingFilePath = null
    pendingOpen = null

    return {
      status: 'cleared',
      fileName: 'Untitled'
    }
  })
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 640,
    minHeight: 480,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    win.loadFile(path.join(__dirname, 'dist/renderer/index.html'))
  }
}

app.whenReady().then(() => {
  registerDrawingFileHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
