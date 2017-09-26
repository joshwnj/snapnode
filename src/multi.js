const path = require('path')
const mkdirp = require('mkdirp')
const chokidar = require('chokidar')
const readBase = require('./read-base')
const writeBase = require('./write-base')
const runScript = require('./run-script')
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')

const browserPath = path.resolve(path.join(__dirname, 'browser', 'index.html'))

// ----

function normalizeEntry (snapDir, entry) {
  if (!entry.name) { entry.name = entry.file }
  if (!entry.args) { entry.args = [] }

  entry.base = readBase(snapDir, entry.file)

  return entry
}

function start (dir, file) {
  console.log('starting', dir, file)

  // TODO: maybe put this in a tmp dir instead
  const snapDir = path.join(dir, '.snapnode')
  mkdirp.sync(snapDir)

  const suite = require(path.join(dir, file))
  const state = {
    multi: true,
    entries: suite.entries.map(normalizeEntry.bind(null, snapDir))
  }

  app.on('ready', () => {
    const win = new BrowserWindow({
      width: 600,
      height: 400
    })

    win.loadURL(`file:///${browserPath}`)

    ipcMain.on('update', (event, index) => {
      const entry = state.entries[index]
      entry.base = Object.assign({}, entry.latest)
      writeBase(snapDir, entry.file, entry.base)

      win.webContents.send('results', JSON.stringify({ index, entry }))
    })

    const watcher = chokidar.watch(dir + '/**/*.js')
    watcher.on('change', (f) => {
      console.log('File changed:', f)

      // update all
      state.entries.forEach((entry, i) => {
        runAndSend(state.entries, i, win)
      })
    })

    win.webContents.on('did-finish-load', () => {
      win.webContents.send('state', JSON.stringify(state))

      // send once to start
      state.entries.forEach((entry, i) => {
        runAndSend(state.entries, i, win)
      })
    })
  })

  function runAndSend (entries, index, win) {
    const entry = entries[index]
    const { file, args } = entry

    runScript(file, args, (err, data) => {
      if (err) {
        data = err
      }

      try {
        addData(entry, data.toString('utf8'))

        win.webContents.send('results', JSON.stringify({ index, entry }))
      } catch (e) {
        console.log(e)
        console.log(data.toString('utf8'))
      }
    })
  }

  function addData (entry, data) {
    if (!entry.base) {
      entry.base = {
        recordedAt: new Date(),
        contentType: 'text',
        data
      }

      writeBase(snapDir, entry.file, entry.base)
      return
    }

    entry.latest = {
      recordedAt: new Date(),
      contentType: 'text',
      data
    }
  }
}

module.exports = start
