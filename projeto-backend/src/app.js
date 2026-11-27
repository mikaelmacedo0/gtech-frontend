require('dotenv').config()
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./config/swagger')
require('./config/migrate')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/v1/user', require('./routes/userRoutes'))
app.use('/v1/category', require('./routes/categoryRoutes'))
app.use('/v1/product', require('./routes/productRoutesV1'))

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' })
})

app.use((error, req, res, next) => {
  console.error(error)
  const status = error.status || (error.type === 'entity.parse.failed' ? 400 : 500)
  res.status(status).json({
    error: status === 400 ? 'Dados da requisição inválidos.' : 'Erro interno do servidor.',
  })
})

module.exports = app
