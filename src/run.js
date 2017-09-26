const runScript = require('./run-script')
const path = require('path')

const shimPath = path.join(__dirname, 'shim.js')

module.exports = function run (entry, cb) {
  if (entry.module) {
    return runScript(shimPath, [ entry.file, entry.func, ...entry.args ], cb)
  }

  return runScript(entry.file, entry.args, cb)
}
