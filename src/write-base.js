const fs = require('fs')
const path = require('path')

module.exports = function writeBase (snapDir, { file, index, base }) {
  const filename = `${file}-${index}`
  fs.writeFile(path.join(snapDir, filename), JSON.stringify(base), (err) => {
    if (err) {
      console.error(err)
    } else {
      console.log('Wrote base snapshot for', file)
    }
  })
}
