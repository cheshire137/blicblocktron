import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'

const packageInfo = require(path.join(__dirname, '..', 'package.json'))

let mainWindow

function onTitleChange(event, prefix) {
  let title = ''
  if (typeof prefix === 'string' && prefix.length > 0) {
    title += `${prefix} - `
  }
  title += packageInfo.name
  mainWindow.setTitle(title)
}

function createWindow() {
  const title = packageInfo.name
  mainWindow = new BrowserWindow({ width: 614, height: 615, title })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
}

app.on('ready', () => {
  app.setAppUserModelId('com.blicblocktron.app')

  createWindow()

  mainWindow.webContents.on('did-finish-load', () => {
    ipcMain.on('title', onTitleChange)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
