const { spawn } = require('child_process')
const path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')
const chokidar = require('chokidar')
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')

const entryPath = path.resolve(path.join(__dirname, 'browser', 'index.html'))

// ----

function readBase (snapDir, file) {
  try {
    const raw = fs.readFileSync(path.join(snapDir, file))
    return raw && JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function writeBase (snapDir, file, base) {
  fs.writeFile(path.join(snapDir, file), JSON.stringify(base), (err) => {
    if (err) {
      console.error(err)
    } else {
      console.log('Wrote base snapshot for', file)
    }
  })
}

function runScript (file, cb) {
  var result
  var err

  const child = spawn('node', [ file ])
  child.stdout.on('data', (data) => {
    if (result === undefined) {
      result = data
    } else {
      result += data
    }
  })

  child.stderr.on('data', (data) => {
    if (err === undefined) {
      err = data
    } else {
      err += data
    }
  })

  child.on('close', (code) => {
    if (code !== 0 && err === undefined) {
      err = 'Exit code: ' + code
    }

    return (err) ? cb(new Error(err)) : cb(null, result)
  })
}

function start (dir, file) {
  console.log('starting', dir, file)

  // TODO: maybe put this in a tmp dir instead
  const snapDir = path.join(dir, '.snapnode')
  mkdirp.sync(snapDir)

  const state = {
    name: file,
    base: readBase(snapDir, file),
    latest: null
  }

  app.on('ready', () => {
    const win = new BrowserWindow({
      width: 600,
      height: 400
    })

    win.loadURL(`file:///${entryPath}`)

    ipcMain.on('update', (event) => {
      state.base = Object.assign({}, state.latest)
      writeBase(snapDir, file, state.base)

      win.webContents.send('state', JSON.stringify(state))
    })

    const watcher = chokidar.watch(dir + '/**/*.js')
    watcher.on('change', () => {
      console.log('File changed:', file)
      runAndSend(file, win)
    })

    win.webContents.on('did-finish-load', () => {
      runAndSend(file, win)
    })
  })

  // ----

  function addData (data) {
    if (!state.base) {
      state.base = {
        recordedAt: new Date(),
        contentType: 'text',
        data
      }

      writeBase(snapDir, file, state.base)
      return
    }

    state.latest = {
      recordedAt: new Date(),
      contentType: 'text',
      data
    }
  }

  function runAndSend (file, win) {
    runScript(file, (err, data) => {
      if (err) {
        data = err
      }

      try {
        addData(data.toString('utf8'))

        win.webContents.send('state', JSON.stringify(state))
      } catch (e) {
        console.log(e)
        console.log(data.toString('utf8'))
      }
    })
  }
}

module.exports = start
