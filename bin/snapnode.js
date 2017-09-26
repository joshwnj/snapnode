#!/usr/bin/env electron

const cwd = process.cwd()
const file = process.argv[2]

require('../lib/multi')(cwd, file)
