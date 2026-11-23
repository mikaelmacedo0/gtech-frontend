import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo.jsx'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Produtos', to: '/products' },
  { label: 'Categorias', to: '/categories' },
  { label: 'Meus pedidos', to: '/my-orders' },
]

export default function Header() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function search(event) {
    event.preventDefault()
    navigate(`/products${query.trim() ? `?filter=${encodeURIComponent(query.trim())}` : ''}`)
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="header-main container">
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span /><span />
        </button>
        <Logo />
        <form className="search-form" role="search" onSubmit={search}>
          <input
            aria-label="Buscar produtos"
            placeholder="Pesquisar produto..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" aria-label="Buscar">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
          </button>
        </form>
        <div className="account-links">
          <a className="signup-link" href="#cadastro">Cadastre-se</a>
          <a className="login-button" href="#entrar">Entrar</a>
        </div>
        <button className="cart-button" aria-label="Carrinho de compras" type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 1.9-1.4L21 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
          <span className="cart-count">2</span>
        </button>
      </div>
      <nav className={`main-nav${menuOpen ? ' main-nav--open' : ''}`} aria-label="Navegação principal">
        <div className="container main-nav__inner">
          {links.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
