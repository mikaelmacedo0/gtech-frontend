const Product = require('../models/Product')

function validateProduct(body, partial = false) {
  const required = ['slug', 'name', 'category', 'gender', 'image', 'price']
  if (!partial) {
    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return `O campo "${field}" é obrigatório.`
      }
    }
  }
  if (body.price !== undefined && (!Number.isFinite(Number(body.price)) || Number(body.price) < 0)) {
    return 'O preço deve ser um número maior ou igual a zero.'
  }
  return null
}

exports.list = (req, res) => {
  const products = Product.findAll({
    search: req.query.search,
    category: req.query.category,
    gender: req.query.gender,
    sort: req.query.sort,
  })
  res.json({ data: products, total: products.length })
}

exports.getById = (req, res) => {
  const product = Product.findById(req.params.id)
  if (!product) return res.status(404).json({ error: 'Produto não encontrado.' })
  res.json(product)
}

exports.getBySlug = (req, res) => {
  const product = Product.findBySlug(req.params.slug)
  if (!product) return res.status(404).json({ error: 'Produto não encontrado.' })
  res.json(product)
}

exports.create = (req, res, next) => {
  const error = validateProduct(req.body)
  if (error) return res.status(400).json({ error })
  try {
    const product = Product.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Slug ou referência já cadastrados.' })
    }
    next(error)
  }
}

exports.update = (req, res, next) => {
  const error = validateProduct(req.body, true)
  if (error) return res.status(400).json({ error })
  try {
    const product = Product.update(req.params.id, req.body)
    if (!product) return res.status(404).json({ error: 'Produto não encontrado.' })
    res.json(product)
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Slug ou referência já cadastrados.' })
    }
    next(error)
  }
}

exports.remove = (req, res) => {
  if (!Product.delete(req.params.id)) {
    return res.status(404).json({ error: 'Produto não encontrado.' })
  }
  res.status(204).send()
}
