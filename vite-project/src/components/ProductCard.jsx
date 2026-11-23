import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products.js'

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__image">
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="quick-view">Ver produto <span aria-hidden="true">↗</span></span>
      </Link>
      <div className="product-card__details">
        <span className="product-category">{product.category}</span>
        <Link className="product-name" to={`/product/${product.id}`}>{product.name}</Link>
        <div className="product-prices">
          {product.priceDiscount ? <span className="old-price">{formatPrice(product.price)}</span> : null}
          <strong>{formatPrice(product.priceDiscount || product.price)}</strong>
        </div>
      </div>
    </article>
  )
}
