const path = require('node:path')
const fs = require('node:fs')
const database = require('./database')

database.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

const migrationsDir = path.join(__dirname, '..', '..', 'migrations')
for (const file of fs.readdirSync(migrationsDir).filter((name) => name.endsWith('.sql')).sort()) {
  const applied = database.prepare('SELECT 1 FROM migrations WHERE name = ?').get(file)
  if (applied) continue

  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
  database.exec('BEGIN')
  try {
    database.exec(sql)
    database.prepare('INSERT INTO migrations (name) VALUES (?)').run(file)
    database.exec('COMMIT')
    console.log(`Migration aplicada: ${file}`)
  } catch (error) {
    database.exec('ROLLBACK')
    throw error
  }
}
