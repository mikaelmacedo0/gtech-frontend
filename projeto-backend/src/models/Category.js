const database = require('../config/database')

function toBoolean(row) {
  if (!row) return null
  return { ...row, use_in_menu: Boolean(row.use_in_menu) }
}

const Category = {
  findAll({ limit = 12, page = 1, fields, useInMenu }) {
    const clauses = []
    const params = []
    if (useInMenu !== undefined) {
      clauses.push('use_in_menu = ?')
      params.push(useInMenu ? 1 : 0)
    }
    const where = clauses.length ? ` WHERE ${clauses.join(' AND ')}` : ''
    const total = database.prepare(`SELECT COUNT(*) AS total FROM categories${where}`).get(...params).total

    let columns = 'id, name, slug, use_in_menu'
    if (fields) {
      const allowed = new Set(['id', 'name', 'slug', 'use_in_menu'])
      const selected = fields.split(',').map((field) => field.trim()).filter((field) => allowed.has(field))
      if (selected.length) columns = [...new Set(['id', ...selected])].join(', ')
    }

    let sql = `SELECT ${columns} FROM categories${where} ORDER BY id`
    if (Number(limit) !== -1) {
      sql += ' LIMIT ? OFFSET ?'
      params.push(Number(limit), (Number(page) - 1) * Number(limit))
    }
    return {
      data: database.prepare(sql).all(...params).map(toBoolean),
      total,
    }
  },
  findById(id) {
    return toBoolean(database.prepare('SELECT id, name, slug, use_in_menu FROM categories WHERE id = ?').get(Number(id)))
  },
  create({ name, slug, use_in_menu = false }) {
    const result = database.prepare(
      'INSERT INTO categories (name, slug, use_in_menu) VALUES (?, ?, ?)',
    ).run(name, slug, use_in_menu ? 1 : 0)
    return Category.findById(result.lastInsertRowid)
  },
  update(id, data) {
    const current = Category.findById(id)
    if (!current) return null
    const merged = { ...current, ...data }
    database.prepare(`
      UPDATE categories SET name=?, slug=?, use_in_menu=?, updated_at=CURRENT_TIMESTAMP WHERE id=?
    `).run(merged.name, merged.slug, merged.use_in_menu ? 1 : 0, Number(id))
    return Category.findById(id)
  },
  delete(id) {
    return database.prepare('DELETE FROM categories WHERE id = ?').run(Number(id)).changes > 0
  },
}

module.exports = Category
