const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const database = require('../config/database')
const { secret } = require('../middleware/auth')

exports.register = (req, res) => {
  const { name, email, password } = req.body
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres.' })
  }

  const existing = database.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase())
  if (existing) return res.status(409).json({ error: 'Este e-mail já está cadastrado.' })

  const passwordHash = bcrypt.hashSync(password, 10)
  const result = database.prepare(`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (?, ?, ?, 'user')
  `).run(name.trim(), email.trim().toLowerCase(), passwordHash)

  const token = jwt.sign({ id: result.lastInsertRowid, role: 'user' }, secret, { expiresIn: '7d' })
  res.status(201).json({
    token,
    user: { id: result.lastInsertRowid, name: name.trim(), email: email.trim().toLowerCase(), role: 'user' },
  })
}

exports.login = (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' })
  }
  const user = database.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase())
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos.' })
  }

  const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '7d' })
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
}

exports.me = (req, res) => {
  const user = database.prepare(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
  ).get(req.user.id)
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' })
  res.json(user)
}
