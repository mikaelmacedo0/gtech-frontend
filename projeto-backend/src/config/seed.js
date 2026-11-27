require('./migrate')
const bcrypt = require('bcryptjs')
const database = require('./database')

const photo = (id, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

const products = [
  ['urban-knit', 'Tênis Urban Knit', 'Tênis', 'Masculino', photo('photo-1542291026-7eec264c27ff'), 399.9, 299.9, '30% OFF', 'DRP-2024-01', 4.8, 128, 'Leveza e estilo para acompanhar seu ritmo.'],
  ['street-classic', 'Tênis Street Classic', 'Tênis', 'Unissex', photo('photo-1552346154-21d32810aba3'), 279.9, 219.9, 'MAIS VENDIDO', null, 4.6, 84, 'Clássico urbano com conforto diário.'],
  ['runner-pro', 'Tênis Runner Pro', 'Tênis', 'Masculino', photo('photo-1495555961986-6d4c1ecb7be3'), 499.9, 389.9, null, null, 4.7, 96, 'Performance para treinos e corridas.'],
  ['casual-wave', 'Tênis Casual Wave', 'Tênis', 'Feminino', photo('photo-1519741497674-611481863552'), 329.9, 259.9, null, null, 4.5, 72, 'Visual leve para o dia a dia.'],
  ['essential-tee', 'Camiseta Essential', 'Camisetas', 'Masculino', photo('photo-1521572163474-6864f9cf17ab'), 119.9, 89.9, null, null, 4.4, 61, 'Camiseta básica de alta qualidade.'],
  ['urban-backpack', 'Mochila Urban', 'Acessórios', 'Unissex', photo('photo-1553062407-98eeb64c6a62'), 249.9, 199.9, null, null, 4.8, 103, 'Organização prática para qualquer rotina.'],
  ['daily-run', 'Tênis Daily Run', 'Tênis', 'Feminino', photo('photo-1460353581641-37baddab0fa2'), 349.9, null, null, null, 4.3, 45, 'Conforto para acompanhar todos os passos.'],
  ['street-cap', 'Boné Street', 'Acessórios', 'Unissex', photo('photo-1588850561407-ed78c282e89b'), 99.9, null, null, null, 4.2, 38, 'Acessório versátil com toque urbano.'],
]

const insert = database.prepare(`
  INSERT OR IGNORE INTO products
  (slug, name, category, gender, image, images, price, price_discount, tag, reference, stars, rating, description)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

database.exec('BEGIN')
try {
  for (const [slug, name, category, gender, image, price, discount, tag, reference, stars, rating, description] of products) {
    insert.run(slug, name, category, gender, image, JSON.stringify([image]), price, discount, tag, reference, stars, rating, description)
  }

  const adminPassword = bcrypt.hashSync('Admin@123', 10)
  database.prepare(`
    INSERT OR IGNORE INTO users (name, firstname, surname, email, password_hash, role)
    VALUES (?, ?, ?, ?, ?, 'admin')
  `).run('Administrador', 'Administrador', 'Drip', 'admin@dripstore.com', adminPassword)

  const categoryIds = {}
  for (const category of [
    ['Tênis', 'tenis', 1],
    ['Camisetas', 'camisetas', 1],
    ['Acessórios', 'acessorios', 1],
  ]) {
    const [name, slug, useInMenu] = category
    database.prepare(
      'INSERT OR IGNORE INTO categories (name, slug, use_in_menu) VALUES (?, ?, ?)',
    ).run(name, slug, useInMenu)
    categoryIds[name] = database.prepare('SELECT id FROM categories WHERE slug = ?').get(slug).id
  }

  const link = database.prepare(
    'INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)',
  )
  for (const row of database.prepare('SELECT id, category FROM products').all()) {
    if (categoryIds[row.category]) link.run(row.id, categoryIds[row.category])
  }
  database.exec('COMMIT')
  console.log('Banco de dados populado com sucesso.')
} catch (error) {
  database.exec('ROLLBACK')
  throw error
}
