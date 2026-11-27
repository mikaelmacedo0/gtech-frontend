require('dotenv').config()
const app = require('./app')

const port = Number(process.env.PORT) || 3000
app.listen(port, () => {
  console.log(`API Drip Store rodando em http://localhost:${port}`)
  console.log(`Documentação disponível em http://localhost:${port}/docs`)
})
