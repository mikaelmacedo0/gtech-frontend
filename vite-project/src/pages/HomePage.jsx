import { Link } from 'react-router-dom'
import Gallery from '../components/Gallery.jsx'
import ProductListing from '../components/ProductListing.jsx'
import Section from '../components/Section.jsx'
import { products } from '../data/products.js'

const heroImages = [
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=2000&q=90',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2000&q=90',
  'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=2000&q=90',
]

const collections = [
  { title: 'Streetwear', subtitle: 'Do seu jeito', image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=85' },
  { title: 'Essenciais', subtitle: 'Menos é mais', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85' },
  { title: 'Movimento', subtitle: 'Vá mais longe', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=85' },
]

export default function HomePage() {
  return (
    <>
      <section className="hero-banner">
        <div className="hero-banner__image"><Gallery images={heroImages} alt="Coleção Drip Store" /></div>
        <div className="container hero-banner__content">
          <span className="hero-kicker">A SUA PRÓXIMA VERSÃO COMEÇA AQUI</span>
          <h1>Vista o que<br />te move<span>.</span></h1>
          <p>Peças que acompanham seu ritmo.<br />Estilo de verdade, sem esforço.</p>
          <Link className="primary-button" to="/products">Descobrir coleção <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="hero-stamp" aria-hidden="true">DRIP<br />YOUR<br />STYLE</div>
      </section>
      <section className="container collection-section">
        <Section title="Encontre seu estilo" titleAlign="left" link={{ text: 'Ver tudo', href: '/products' }}>
          <div className="collection-grid">
            {collections.map((collection, index) => (
              <Link className={`collection-card collection-card--${index + 1}`} to="/products" key={collection.title}>
                <img src={collection.image} alt="" loading="lazy" />
                <span className="collection-copy"><small>{collection.subtitle}</small><strong>{collection.title}</strong></span>
                <span className="collection-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </Section>
      </section>
      <section className="container trending-section">
        <Section title="Em alta agora" titleAlign="left" link={{ text: 'Ver todos os produtos', href: '/products' }}>
          <ProductListing products={products.slice(0, 4)} />
        </Section>
      </section>
      <section className="editorial">
        <div className="editorial__image" />
        <div className="editorial__copy">
          <span className="eyebrow">DRIP MOVEMENT · 2025</span>
          <h2>Não siga o ritmo.<br /><em>Crie o seu.</em></h2>
          <p>Feito para quem transforma cada caminho em uma oportunidade de ir além.</p>
          <Link className="text-link" to="/products">Conheça a coleção <span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section className="container new-arrivals">
        <Section title="Escolhas da semana" titleAlign="left" link={{ text: 'Explorar', href: '/products' }}>
          <ProductListing products={products.slice(4, 8)} />
        </Section>
      </section>
      <section className="newsletter">
        <div className="container newsletter__inner">
          <div><span className="eyebrow">A GENTE SE VÊ NA SUA INBOX</span><h2>Novidades boas<br />não ficam guardadas.</h2></div>
          <form onSubmit={(event) => event.preventDefault()} className="newsletter-form">
            <label htmlFor="newsletter-email">Seu melhor e-mail</label>
            <div><input id="newsletter-email" type="email" placeholder="voce@email.com" required /><button type="submit" aria-label="Inscrever e-mail">→</button></div>
            <small>Ao se inscrever, você concorda com nossa política de privacidade.</small>
          </form>
        </div>
      </section>
    </>
  )
}
