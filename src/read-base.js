const fs = require('fs')
const path = require('path')

module.exports = function readBase (snapDir, file) {
  try {
    const raw = fs.readFileSync(path.join(snapDir, file))
    return raw && JSON.parse(raw)
  } catch (e) {
    console.error(e)
    return null
  }
}
