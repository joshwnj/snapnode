const path = require('path')
const mkdirp = require('mkdirp')
const chokidar = require('chokidar')
const fresh = require('fresh-require')
const readBase = require('./read-base')
const writeBase = require('./write-base')
const run = require('./run')
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')

const browserPath = path.resolve(path.join(__dirname, 'browser', 'index.html'))

// ----

function normalizeEntry (snapDir, entry, index) {
  if (!entry.name) { entry.name = entry.file }
  if (!entry.args) { entry.args = [] }

  entry.index = index
  entry.base = readBase(snapDir, entry)

  return entry
}

function reloadConfig (filename, snapDir, state) {
  const config = fresh(filename, require)
  state.entries = config.entries.map(normalizeEntry.bind(null, snapDir))
}

function start (dir, file) {
  console.log('starting', dir, file)

  // TODO: maybe put this in a tmp dir instead
  const snapDir = path.join(dir, '.snapnode')
  mkdirp.sync(snapDir)

  const state = {}
  const pathToConfig = path.join(dir, file)
  reloadConfig(pathToConfig, snapDir, state)

  app.on('ready', () => {
    const win = new BrowserWindow({
      width: 600,
      height: 400
    })

    win.loadURL(`file:///${browserPath}`)

    ipcMain.on('update', (event, index) => {
      const entry = state.entries[index]
      entry.base = Object.assign({}, entry.latest)
      writeBase(snapDir, entry)

      win.webContents.send('results', JSON.stringify({ index, entry }))
    })

    const watcher = chokidar.watch(dir + '/**/*.js')
    watcher.on('change', (f) => {
      console.log('File changed:', f)

      // special case: reload the config if it changed
      if (f === pathToConfig) {
        reloadConfig(pathToConfig, snapDir, state)
        win.webContents.send('state', JSON.stringify(state))
      }

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

    win.webContents.send('loading', index)

    run(entry, (err, data) => {
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

      writeBase(snapDir, entry)
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
