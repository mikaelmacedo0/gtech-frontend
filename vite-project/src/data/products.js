const photo = (id, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const products = [
  {
    id: 'urban-knit',
    name: 'Tênis Urban Knit',
    category: 'Tênis',
    gender: 'Masculino',
    image: photo('photo-1542291026-7eec264c27ff'),
    images: [
      photo('photo-1542291026-7eec264c27ff'),
      photo('photo-1552346154-21d32810aba3'),
      photo('photo-1495555961986-6d4c1ecb7be3'),
    ],
    price: 399.9,
    priceDiscount: 299.9,
    tag: '30% OFF',
    reference: 'DRP-2024-01',
    stars: '4.8',
    rating: 128,
    description:
      'Leveza e estilo para acompanhar seu ritmo. O Urban Knit combina cabedal respirável, amortecimento macio e solado flexível para o conforto de todos os dias.',
  },
  {
    id: 'street-classic',
    name: 'Tênis Street Classic',
    category: 'Tênis',
    gender: 'Unissex',
    image: photo('photo-1552346154-21d32810aba3'),
    price: 279.9,
    priceDiscount: 219.9,
    tag: 'MAIS VENDIDO',
  },
  {
    id: 'runner-pro',
    name: 'Tênis Runner Pro',
    category: 'Tênis',
    gender: 'Masculino',
    image: photo('photo-1495555961986-6d4c1ecb7be3'),
    price: 499.9,
    priceDiscount: 389.9,
  },
  {
    id: 'casual-wave',
    name: 'Tênis Casual Wave',
    category: 'Tênis',
    gender: 'Feminino',
    image: photo('photo-1519741497674-611481863552'),
    price: 329.9,
    priceDiscount: 259.9,
  },
  {
    id: 'essential-tee',
    name: 'Camiseta Essential',
    category: 'Camisetas',
    gender: 'Masculino',
    image: photo('photo-1521572163474-6864f9cf17ab'),
    price: 119.9,
    priceDiscount: 89.9,
  },
  {
    id: 'urban-backpack',
    name: 'Mochila Urban',
    category: 'Acessórios',
    gender: 'Unissex',
    image: photo('photo-1553062407-98eeb64c6a62'),
    price: 249.9,
    priceDiscount: 199.9,
  },
  {
    id: 'daily-run',
    name: 'Tênis Daily Run',
    category: 'Tênis',
    gender: 'Feminino',
    image: photo('photo-1460353581641-37baddab0fa2'),
    price: 349.9,
  },
  {
    id: 'street-cap',
    name: 'Boné Street',
    category: 'Acessórios',
    gender: 'Unissex',
    image: photo('photo-1588850561407-ed78c282e89b'),
    price: 99.9,
  },
]

export const formatPrice = (price) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
