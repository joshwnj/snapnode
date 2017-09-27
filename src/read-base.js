const fs = require('fs')
const path = require('path')

module.exports = function readBase (snapDir, { file, index }) {
  const filename = `${file}-${index}`
  try {
    const raw = fs.readFileSync(path.join(snapDir, filename))
    return raw && JSON.parse(raw)
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('Base not found', filename)
    } else {
      console.error(e)
    }

    return null
  }
}
