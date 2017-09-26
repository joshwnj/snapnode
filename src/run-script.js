const { spawn } = require('child_process')

module.exports = function runScript (file, args, cb) {
  var result
  var err

  const child = spawn('node', [ file, ...args ])
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
