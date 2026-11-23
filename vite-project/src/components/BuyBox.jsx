import { useState } from 'react'
import { formatPrice } from '../data/products.js'

export default function BuyBox({ product, children }) {
  const [added, setAdded] = useState(false)
  return (
    <div className="buy-box">
      <span className="eyebrow">{product.category} · DRIP STORE</span>
      <h1>{product.name}</h1>
      <p className="reference">Ref.: {product.reference || `DRP-${product.id.toUpperCase()}`}</p>
      <div className="rating-row"><span className="rating-stars">★★★★★</span><strong>{product.stars || '4.7'}</strong><span>({product.rating || 86} avaliações)</span></div>
      <div className="buy-prices">
        {product.priceDiscount && <span className="buy-old-price">{formatPrice(product.price)}</span>}
        <strong>{formatPrice(product.priceDiscount || product.price)}</strong>
        {product.priceDiscount && <span className="discount-pill">-{Math.round((1 - product.priceDiscount / product.price) * 100)}%</span>}
      </div>
      <p className="installment">ou 10x de {formatPrice((product.priceDiscount || product.price) / 10)} sem juros</p>
      <p className="buy-description">{product.description || 'Design contemporâneo, conforto que dura o dia todo e a qualidade que você procura. Uma escolha versátil para compor seu estilo.'}</p>
      {children}
      <div className="shipping-note"><span aria-hidden="true">✦</span> Frete grátis acima de R$ 199</div>
      <button className={`buy-button${added ? ' buy-button--added' : ''}`} onClick={() => setAdded(true)}>
        {added ? 'ADICIONADO AO CARRINHO ✓' : 'COMPRAR'}
      </button>
      {added && <p className="cart-feedback" role="status">Produto adicionado ao carrinho.</p>}
    </div>
  )
}
