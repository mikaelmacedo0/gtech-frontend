const request = require('supertest')
const app = require('../src/app')

describe('API v1', () => {
  test('health check', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('ok')
  })

  test('lista categorias', async () => {
    const response = await request(app).get('/v1/category/search?limit=-1')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body).toHaveProperty('total')
  })

  test('lista produtos', async () => {
    const response = await request(app).get('/v1/product/search?limit=12&page=1')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
  })

  test('rota inexistente retorna 404', async () => {
    const response = await request(app).get('/rota-inexistente')
    expect(response.status).toBe(404)
  })
})
