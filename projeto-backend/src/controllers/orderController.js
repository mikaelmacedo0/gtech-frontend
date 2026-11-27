const database = require('../config/database')

exports.create = (req, res) => {
  const { items } = req.body
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Informe ao menos um item no pedido.' })
  }

  database.exec('BEGIN')
  try {
    let total = 0
    const orderItems = []
    for (const item of items) {
      const quantity = Number(item.quantity)
      if (!Number.isInteger(quantity) || quantity < 1) throw new Error('INVALID_QUANTITY')
      const product = database.prepare('SELECT id, price, price_discount FROM products WHERE id = ?').get(Number(item.productId))
      if (!product) throw new Error('PRODUCT_NOT_FOUND')
      const unitPrice = product.price_discount ?? product.price
      total += unitPrice * quantity
      orderItems.push({ productId: product.id, quantity, unitPrice })
    }

    const order = database.prepare(
      'INSERT INTO orders (user_id, total) VALUES (?, ?)',
    ).run(req.user.id, total)
    const insertItem = database.prepare(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
    )
    for (const item of orderItems) {
      insertItem.run(order.lastInsertRowid, item.productId, item.quantity, item.unitPrice)
    }
    database.exec('COMMIT')
    res.status(201).json(getOrder(order.lastInsertRowid))
  } catch (error) {
    database.exec('ROLLBACK')
    if (error.message === 'INVALID_QUANTITY') {
      return res.status(400).json({ error: 'A quantidade deve ser um número inteiro maior que zero.' })
    }
    if (error.message === 'PRODUCT_NOT_FOUND') {
      return res.status(404).json({ error: 'Um dos produtos não foi encontrado.' })
    }
    throw error
  }
}

function getOrder(id) {
  const order = database.prepare('SELECT * FROM orders WHERE id = ?').get(Number(id))
  const items = database.prepare(`
    SELECT oi.*, p.name, p.slug
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?
  `).all(Number(id))
  return { ...order, items }
}

exports.list = (req, res) => {
  const where = req.user.role === 'admin' ? '' : ' WHERE user_id = ?'
  const params = req.user.role === 'admin' ? [] : [req.user.id]
  const orders = database.prepare(`SELECT * FROM orders${where} ORDER BY created_at DESC`).all(...params)
  res.json({ data: orders.map((order) => getOrder(order.id)), total: orders.length })
}

exports.getById = (req, res) => {
  const order = database.prepare('SELECT * FROM orders WHERE id = ?').get(Number(req.params.id))
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' })
  if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Você não tem acesso a este pedido.' })
  }
  res.json(getOrder(order.id))
}
