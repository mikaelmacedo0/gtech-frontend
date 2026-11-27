const bcrypt = require('bcryptjs')
const User = require('../models/User')

exports.getById = (req, res) => {
  const user = User.findById(req.params.id)
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' })
  res.json(user)
}

exports.create = (req, res, next) => {
  const { firstname, surname, email, password, confirmPassword } = req.body
  if (!firstname?.trim() || !surname?.trim() || !email?.trim() || !password || password !== confirmPassword) {
    return res.status(400).json({ error: 'Dados inválidos ou senha e confirmação diferentes.' })
  }
  if (User.findByEmail(email.trim())) {
    return res.status(400).json({ error: 'Este e-mail já está cadastrado.' })
  }
  try {
    const user = User.create({
      firstname,
      surname,
      email: email.trim(),
      passwordHash: bcrypt.hashSync(password, 10),
    })
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

exports.update = (req, res, next) => {
  const { firstname, surname, email } = req.body
  if (!firstname?.trim() || !surname?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'Nome, sobrenome e e-mail são obrigatórios.' })
  }
  try {
    if (!User.findById(req.params.id)) return res.status(404).json({ error: 'Usuário não encontrado.' })
    User.update(req.params.id, req.body)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

exports.remove = (req, res) => {
  if (!User.delete(req.params.id)) return res.status(404).json({ error: 'Usuário não encontrado.' })
  res.status(204).send()
}
