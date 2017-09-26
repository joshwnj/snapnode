const fs = require('fs')
const path = require('path')

module.exports = function writeBase (snapDir, file, base) {
  fs.writeFile(path.join(snapDir, file), JSON.stringify(base), (err) => {
    if (err) {
      console.error(err)
    } else {
      console.log('Wrote base snapshot for', file)
    }
  })
}
