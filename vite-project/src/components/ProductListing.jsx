import ProductCard from './ProductCard.jsx'

export default function ProductListing({ products }) {
  if (!products.length) {
    return <div className="empty-state"><span>⌕</span><h3>Nenhum produto encontrado</h3><p>Tente mudar os filtros ou buscar por outro termo.</p></div>
  }

  return (
    <div className="product-grid">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}
