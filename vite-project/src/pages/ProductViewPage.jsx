import { Link, useParams } from 'react-router-dom'
import BuyBox from '../components/BuyBox.jsx'
import Gallery from '../components/Gallery.jsx'
import ProductListing from '../components/ProductListing.jsx'
import ProductOptions from '../components/ProductOptions.jsx'
import Section from '../components/Section.jsx'
import { products } from '../data/products.js'

export default function ProductViewPage() {
  const { id } = useParams()
  const product = products.find((item) => item.id === id) || products[0]
  const recommendations = products.filter((item) => item.id !== product.id).slice(0, 4)

  return (
    <>
      <div className="container product-page">
        <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><Link to="/products">Produtos</Link><span>/</span><strong>{product.name}</strong></div>
        <div className="product-detail">
          <Gallery images={product.images || [product.image, products[1].image, products[2].image]} showThumbs alt={product.name} />
          <BuyBox product={product}>
            <ProductOptions label="Tamanho" options={['38', '39', '40', '41', '42', '43']} />
            <ProductOptions label="Cor" type="color" shape="circle" options={['#252525', '#d2c8bc', '#597264', '#c34a38']} />
          </BuyBox>
        </div>
        <section className="product-description">
          <span className="eyebrow">DETALHES QUE FAZEM A DIFERENÇA</span>
          <h2>Feito para ir com você.</h2>
          <p>{product.description || 'Design contemporâneo, conforto que dura o dia todo e qualidade em cada detalhe. Uma escolha versátil, feita para acompanhar todos os seus planos.'}</p>
        </section>
        <Section title="Você também pode gostar" titleAlign="left" link={{ text: 'Ver todos', href: '/products' }}>
          <ProductListing products={recommendations} />
        </Section>
      </div>
    </>
  )
}
