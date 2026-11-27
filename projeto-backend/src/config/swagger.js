module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Drip Store API',
    version: '1.0.0',
    description: 'API REST para catálogo de produtos e pedidos da Drip Store.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  paths: {
    '/api/products': {
      get: {
        summary: 'Lista produtos',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'gender', in: 'query', schema: { type: 'string' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['low', 'high'] } },
        ],
        responses: { 200: { description: 'Lista de produtos' } },
      },
      post: {
        summary: 'Cria produto',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Produto criado' }, 401: { description: 'Não autenticado' } },
      },
    },
    '/api/products/{id}': {
      get: { summary: 'Busca produto por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Produto' }, 404: { description: 'Não encontrado' } } },
      put: { summary: 'Atualiza produto', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Produto atualizado' } } },
      delete: { summary: 'Remove produto', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: { description: 'Removido' } } },
    },
    '/api/auth/register': { post: { summary: 'Cadastra usuário', responses: { 201: { description: 'Usuário criado' } } } },
    '/api/auth/login': { post: { summary: 'Autentica usuário', responses: { 200: { description: 'Token JWT' } } } },
    '/api/orders': {
      get: { summary: 'Lista pedidos do usuário', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Pedidos' } } },
      post: { summary: 'Cria pedido', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Pedido criado' } } },
    },
  },
}
