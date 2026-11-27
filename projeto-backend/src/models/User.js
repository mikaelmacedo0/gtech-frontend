const database = require('../config/database')

const User = {
  findById(id) {
    const row = database.prepare(`
      SELECT id, firstname, surname, email, name FROM users WHERE id = ?
    `).get(Number(id))
    if (!row) return null
    const names = row.name?.trim().split(/\s+/) || []
    return {
      id: row.id,
      firstname: row.firstname || names[0] || '',
      surname: row.surname || names.slice(1).join(' ') || '',
      email: row.email,
    }
  },
  findByEmail(email) {
    return database.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase())
  },
  create({ firstname, surname, email, passwordHash }) {
    const result = database.prepare(`
      INSERT INTO users (name, firstname, surname, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?, 'user')
    `).run(`${firstname.trim()} ${surname.trim()}`, firstname.trim(), surname.trim(), email.toLowerCase(), passwordHash)
    return User.findById(result.lastInsertRowid)
  },
  update(id, data) {
    const current = User.findById(id)
    if (!current) return null
    const merged = { ...current, ...data }
    database.prepare(`
      UPDATE users SET firstname=?, surname=?, email=?, name=?, updated_at=CURRENT_TIMESTAMP WHERE id=?
    `).run(merged.firstname, merged.surname, merged.email.toLowerCase(), `${merged.firstname} ${merged.surname}`.trim(), Number(id))
    return User.findById(id)
  },
  delete(id) {
    return database.prepare('DELETE FROM users WHERE id = ?').run(Number(id)).changes > 0
  },
}

module.exports = User
