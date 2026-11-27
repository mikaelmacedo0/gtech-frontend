const database = require('../config/database')

function rowToProduct(row) {
  if (!row) return null
  return {
    ...row,
    images: JSON.parse(row.images || '[]'),
  }
}

const Product = {
  findAll({ search, category, gender, sort }) {
    const clauses = []
    const params = []
    if (search) {
      clauses.push('(name LIKE ? OR category LIKE ? OR gender LIKE ?)')
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }
    if (category) {
      clauses.push('category = ?')
      params.push(category)
    }
    if (gender) {
      clauses.push('gender = ?')
      params.push(gender)
    }

    let orderBy = 'created_at DESC'
    if (sort === 'low') orderBy = 'COALESCE(price_discount, price) ASC'
    if (sort === 'high') orderBy = 'COALESCE(price_discount, price) DESC'

    const sql = `SELECT * FROM products${clauses.length ? ` WHERE ${clauses.join(' AND ')}` : ''} ORDER BY ${orderBy}`
    return database.prepare(sql).all(...params).map(rowToProduct)
  },
  findById(id) {
    return rowToProduct(database.prepare('SELECT * FROM products WHERE id = ?').get(Number(id)))
  },
  findBySlug(slug) {
    return rowToProduct(database.prepare('SELECT * FROM products WHERE slug = ?').get(slug))
  },
  create(data) {
    const result = database.prepare(`
      INSERT INTO products
      (slug, name, category, gender, image, images, price, price_discount, tag, reference, stars, rating, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.slug, data.name, data.category, data.gender, data.image,
      JSON.stringify(data.images || []), data.price, data.priceDiscount ?? null,
      data.tag ?? null, data.reference ?? null, data.stars ?? 0, data.rating ?? 0,
      data.description ?? null,
    )
    return Product.findById(result.lastInsertRowid)
  },
  update(id, data) {
    const current = Product.findById(id)
    if (!current) return null
    const merged = { ...current, ...data, images: data.images ?? current.images }
    database.prepare(`
      UPDATE products SET slug=?, name=?, category=?, gender=?, image=?, images=?,
      price=?, price_discount=?, tag=?, reference=?, stars=?, rating=?, description=?,
      updated_at=CURRENT_TIMESTAMP WHERE id=?
    `).run(
      merged.slug, merged.name, merged.category, merged.gender, merged.image,
      JSON.stringify(merged.images), merged.price, merged.priceDiscount ?? null,
      merged.tag ?? null, merged.reference ?? null, merged.stars, merged.rating,
      merged.description ?? null, Number(id),
    )
    return Product.findById(id)
  },
  delete(id) {
    return database.prepare('DELETE FROM products WHERE id = ?').run(Number(id)).changes > 0
  },
}

module.exports = Product
