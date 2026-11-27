const path = require('node:path')
const fs = require('node:fs')
const { DatabaseSync } = require('node:sqlite')

const dataDir = path.join(__dirname, '..', '..', 'data')
fs.mkdirSync(dataDir, { recursive: true })

const database = new DatabaseSync(path.join(dataDir, 'drip-store.sqlite'))
database.exec('PRAGMA foreign_keys = ON')
database.exec('PRAGMA busy_timeout = 5000')

module.exports = database
