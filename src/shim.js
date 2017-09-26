const path = require('path')
const file = process.argv[2]
const func = process.argv[3]
const args = process.argv.slice(4)

console.log(require(path.join(process.cwd(), file))[func].apply(null, args))
