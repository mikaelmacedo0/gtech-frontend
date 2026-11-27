const database = require('../config/database')

function parseValues(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
    } catch {}
    return value.split(',').map((item) => item.trim()).filter(Boolean)
  }
  return []
}

function getImages(productId) {
  return database.prepare(
    'SELECT id, path AS content FROM product_images WHERE product_id = ? AND enabled = 1',
  ).all(productId)
}

function getOptions(productId) {
  return database.prepare(
    'SELECT id, title, shape, radius, type, option_values FROM product_options WHERE product_id = ?',
  ).all(productId).map((option) => ({
    id: option.id,
    title: option.title,
    shape: option.shape,
    radius: option.radius,
    type: option.type,
    values: parseValues(option.option_values),
  }))
}

function getCategoryIds(productId) {
  return database.prepare(
    'SELECT category_id FROM product_categories WHERE product_id = ? ORDER BY category_id',
  ).all(productId).map((row) => row.category_id)
}

function toProduct(row) {
  if (!row) return null
  return {
    id: row.id,
    enabled: Boolean(row.enabled),
    name: row.name,
    slug: row.slug,
    use_in_menu: Boolean(row.use_in_menu),
    stock: row.stock,
    description: row.description,
    price: row.price,
    price_with_discount: row.price_with_discount ?? row.price_discount ?? 0,
    category_ids: getCategoryIds(row.id),
    images: getImages(row.id),
    options: getOptions(row.id),
  }
}

exports.search = (req, res) => {
  const limit = req.query.limit === undefined ? 12 : Number(req.query.limit)
  const page = req.query.page === undefined ? 1 : Number(req.query.page)
  if (!Number.isInteger(limit) || limit < -1 || limit === 0 || !Number.isInteger(page) || page < 1) {
    return res.status(400).json({ error: 'Parâmetros de paginação inválidos.' })
  }

  const clauses = []
  const params = []
  if (req.query.match) {
    clauses.push('(p.name LIKE ? OR p.description LIKE ?)')
    params.push(`%${req.query.match}%`, `%${req.query.match}%`)
  }
  if (req.query.category_ids) {
    const ids = req.query.category_ids.split(',').map(Number).filter(Number.isInteger)
    if (!ids.length) return res.status(400).json({ error: 'category_ids inválido.' })
    clauses.push(`p.id IN (SELECT product_id FROM product_categories WHERE category_id IN (${ids.map(() => '?').join(',')}))`)
    params.push(...ids)
  }
  if (req.query['price-range']) {
    const [min, max] = req.query['price-range'].split('-').map(Number)
    if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < min) {
      return res.status(400).json({ error: 'price-range inválido.' })
    }
    clauses.push('COALESCE(p.price_with_discount, p.price_discount, p.price) BETWEEN ? AND ?')
    params.push(min, max)
  }

  const where = clauses.length ? ` WHERE ${clauses.join(' AND ')}` : ''
  const total = database.prepare(`SELECT COUNT(*) AS total FROM products p${where}`).get(...params).total

  let sql = `SELECT * FROM products p${where} ORDER BY p.id`
  if (limit !== -1) {
    sql += ' LIMIT ? OFFSET ?'
    params.push(limit, (page - 1) * limit)
  }
  let rows = database.prepare(sql).all(...params).map(toProduct)

  if (req.query.fields) {
    const allowed = new Set(['id', 'enabled', 'name', 'slug', 'use_in_menu', 'stock', 'description', 'price', 'price_with_discount', 'category_ids', 'images', 'options'])
    const fields = req.query.fields.split(',').map((field) => field.trim()).filter((field) => allowed.has(field))
    if (fields.length) rows = rows.map((row) => Object.fromEntries(fields.map((field) => [field, row[field]])))
  }
  res.json({ data: rows, total, limit, page })
}

exports.getById = (req, res) => {
  const row = database.prepare('SELECT * FROM products WHERE id = ?').get(Number(req.params.id))
  if (!row) return res.status(404).json({ error: 'Produto não encontrado.' })
  res.json(toProduct(row))
}

exports.create = (req, res, next) => {
  const { name, slug, price } = req.body
  if (!name?.trim() || !slug?.trim() || !Number.isFinite(Number(price))) {
    return res.status(400).json({ error: 'Nome, slug e preço são obrigatórios.' })
  }
  try {
    database.exec('BEGIN')
    const result = database.prepare(`
      INSERT INTO products
      (enabled, name, slug, use_in_menu, stock, description, price, price_discount, price_with_discount, category, gender, image, images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]')
    `).run(
      req.body.enabled ? 1 : 0,
      name.trim(),
      slug.trim(),
      req.body.use_in_menu ? 1 : 0,
      Number(req.body.stock) || 0,
      req.body.description || null,
      Number(price),
      req.body.price_with_discount === undefined ? null : Number(req.body.price_with_discount),
      req.body.price_with_discount === undefined ? null : Number(req.body.price_with_discount),
      'Geral',
      'Unissex',
      req.body.images?.[0]?.content || '',
    )
    saveRelations(result.lastInsertRowid, req.body)
    database.exec('COMMIT')
    const row = database.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json(toProduct(row))
  } catch (error) {
    database.exec('ROLLBACK')
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(400).json({ error: 'Slug já cadastrado.' })
    next(error)
  }
}

function saveRelations(productId, body) {
  const categoryIds = body.category_ids || []
  const categoryStatement = database.prepare(
    'INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)',
  )
  for (const categoryId of categoryIds) {
    if (Number.isInteger(Number(categoryId))) categoryStatement.run(productId, Number(categoryId))
  }

  const imageStatement = database.prepare(
    'INSERT INTO product_images (product_id, enabled, path) VALUES (?, 1, ?)',
  )
  for (const image of body.images || []) {
    if (image.deleted) continue
    if (image.content) imageStatement.run(productId, image.content)
  }

  const optionStatement = database.prepare(`
    INSERT INTO product_options (product_id, title, shape, radius, type, option_values)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  for (const option of body.options || []) {
    const values = option.values || option.value || []
    const radius = typeof option.radius === 'string'
      ? Number.parseInt(option.radius, 10) || 0
      : Number(option.radius) || 0
    optionStatement.run(
      productId,
      option.title,
      ['square', 'circle'].includes(option.shape) ? option.shape : 'square',
      radius,
      ['text', 'color'].includes(option.type) ? option.type : 'text',
      JSON.stringify(parseValues(values)),
    )
  }
}

exports.update = (req, res, next) => {
  const id = Number(req.params.id)
  const current = database.prepare('SELECT * FROM products WHERE id = ?').get(id)
  if (!current) return res.status(404).json({ error: 'Produto não encontrado.' })
  if (req.body.name !== undefined && !req.body.name.trim()) {
    return res.status(400).json({ error: 'Nome inválido.' })
  }
  try {
    database.exec('BEGIN')
    const merged = {
      enabled: req.body.enabled ?? Boolean(current.enabled),
      name: req.body.name ?? current.name,
      slug: req.body.slug ?? current.slug,
      use_in_menu: req.body.use_in_menu ?? Boolean(current.use_in_menu),
      stock: req.body.stock ?? current.stock,
      description: req.body.description ?? current.description,
      price: req.body.price ?? current.price,
      price_with_discount: req.body.price_with_discount ?? current.price_with_discount ?? current.price_discount,
    }
    database.prepare(`
      UPDATE products SET enabled=?, name=?, slug=?, use_in_menu=?, stock=?, description=?,
      price=?, price_discount=?, price_with_discount=?, updated_at=CURRENT_TIMESTAMP WHERE id=?
    `).run(
      merged.enabled ? 1 : 0, merged.name, merged.slug, merged.use_in_menu ? 1 : 0,
      Number(merged.stock), merged.description, Number(merged.price),
      merged.price_with_discount ?? null, merged.price_with_discount ?? null, id,
    )

    if (Array.isArray(req.body.category_ids)) {
      database.prepare('DELETE FROM product_categories WHERE product_id = ?').run(id)
      const insert = database.prepare('INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)')
      for (const categoryId of req.body.category_ids) insert.run(id, Number(categoryId))
    }

    if (Array.isArray(req.body.images)) {
      for (const image of req.body.images) {
        if (image.id && image.deleted) {
          database.prepare('DELETE FROM product_images WHERE id=? AND product_id=?').run(image.id, id)
        } else if (image.id && image.content) {
          database.prepare('UPDATE product_images SET path=?, enabled=1 WHERE id=? AND product_id=?').run(image.content, image.id, id)
        } else if (image.content) {
          database.prepare('INSERT INTO product_images (product_id, enabled, path) VALUES (?,1,?)').run(id, image.content)
        }
      }
    }

    if (Array.isArray(req.body.options)) {
      for (const option of req.body.options) {
        if (option.id && option.deleted) {
          database.prepare('DELETE FROM product_options WHERE id=? AND product_id=?').run(option.id, id)
        } else if (option.id) {
          const old = database.prepare('SELECT * FROM product_options WHERE id=? AND product_id=?').get(option.id, id)
          if (old) {
            const values = option.values || option.value || parseValues(old.option_values)
            database.prepare(`
              UPDATE product_options SET title=?, shape=?, radius=?, type=?, option_values=? WHERE id=? AND product_id=?
            `).run(
              option.title ?? old.title,
              option.shape ?? old.shape,
              option.radius === undefined ? old.radius : (Number.parseInt(String(option.radius), 10) || 0),
              option.type ?? old.type,
              JSON.stringify(parseValues(values)),
              option.id,
              id,
            )
          }
        } else {
          saveRelations(id, { category_ids: [], images: [], options: [option] })
        }
      }
    }
    database.exec('COMMIT')
    res.status(204).send()
  } catch (error) {
    database.exec('ROLLBACK')
    next(error)
  }
}

exports.remove = (req, res) => {
  const result = database.prepare('DELETE FROM products WHERE id=?').run(Number(req.params.id))
  if (!result.changes) return res.status(404).json({ error: 'Produto não encontrado.' })
  res.status(204).send()
}
