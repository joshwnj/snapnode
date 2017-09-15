const path = require('path')
const { 
  app, 
  BrowserWindow,
  ipcMain
} = require('electron')

const entryPath = path.resolve(path.join(__dirname, 'browser', 'index.html'))

// ----

app.on('ready', () => {
  const win = new BrowserWindow({
    width: 600,
    height: 400
  })

  win.loadURL(`file:///${entryPath}`)
})

