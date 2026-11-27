const Category = require('../models/Category')

exports.search = (req, res) => {
  const limit = req.query.limit === undefined ? 12 : Number(req.query.limit)
  const page = req.query.page === undefined ? 1 : Number(req.query.page)
  if (!Number.isInteger(limit) || limit < -1 || limit === 0 || !Number.isInteger(page) || page < 1) {
    return res.status(400).json({ error: 'Parâmetros de paginação inválidos.' })
  }
  let useInMenu
  if (req.query.use_in_menu !== undefined) {
    if (!['true', 'false', '1', '0'].includes(req.query.use_in_menu)) {
      return res.status(400).json({ error: 'use_in_menu deve ser verdadeiro ou falso.' })
    }
    useInMenu = ['true', '1'].includes(req.query.use_in_menu)
  }
  const result = Category.findAll({ limit, page, fields: req.query.fields, useInMenu })
  res.json({ ...result, limit, page })
}

exports.getById = (req, res) => {
  const category = Category.findById(req.params.id)
  if (!category) return res.status(404).json({ error: 'Categoria não encontrada.' })
  res.json(category)
}

exports.create = (req, res, next) => {
  const { name, slug } = req.body
  if (!name?.trim() || !slug?.trim()) {
    return res.status(400).json({ error: 'Nome e slug são obrigatórios.' })
  }
  try {
    res.status(201).json(Category.create({ ...req.body, name: name.trim(), slug: slug.trim() }))
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Slug já cadastrado.' })
    }
    next(error)
  }
}

exports.update = (req, res, next) => {
  if (!req.body.name?.trim() || !req.body.slug?.trim()) {
    return res.status(400).json({ error: 'Nome e slug são obrigatórios.' })
  }
  try {
    if (!Category.findById(req.params.id)) return res.status(404).json({ error: 'Categoria não encontrada.' })
    Category.update(req.params.id, req.body)
    res.status(204).send()
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Slug já cadastrado.' })
    }
    next(error)
  }
}

exports.remove = (req, res) => {
  if (!Category.delete(req.params.id)) return res.status(404).json({ error: 'Categoria não encontrada.' })
  res.status(204).send()
}
