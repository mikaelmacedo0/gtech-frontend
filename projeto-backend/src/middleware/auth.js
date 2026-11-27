const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET || 'change-this-secret-in-production'

function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação não informado.' })
  }

  try {
    req.user = jwt.verify(header.slice(7), secret)
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}

function authorizeAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores.' })
  }
  next()
}

module.exports = { authenticate, authorizeAdmin, secret }
