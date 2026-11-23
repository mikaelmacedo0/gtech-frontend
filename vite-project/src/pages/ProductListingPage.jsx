import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterGroup from '../components/FilterGroup.jsx'
import ProductListing from '../components/ProductListing.jsx'
import Section from '../components/Section.jsx'
import { products } from '../data/products.js'

export default function ProductListingPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('filter') || ''
  const [sort, setSort] = useState('')
  const [filters, setFilters] = useState({ categories: [], genders: [] })

  function toggleFilter(group, value) {
    setFilters((current) => ({
      ...current,
      [group]: current[group].includes(value)
        ? current[group].filter((item) => item !== value)
        : [...current[group], value],
    }))
  }

  const results = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesQuery = `${product.name} ${product.category} ${product.gender}`.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = !filters.categories.length || filters.categories.includes(product.category)
      const matchesGender = !filters.genders.length || filters.genders.includes(product.gender)
      return matchesQuery && matchesCategory && matchesGender
    })
    if (sort) {
      const price = (item) => item.priceDiscount || item.price
      filtered.sort((a, b) => sort === 'low' ? price(a) - price(b) : price(b) - price(a))
    }
    return filtered
  }, [filters, query, sort])

  return (
    <div className="container listing-page">
      <div className="breadcrumbs"><a href="/">Home</a><span>/</span><strong>Produtos</strong></div>
      <div className="listing-title">
        <div><span className="eyebrow">A CURADORIA DRIP</span><h1>{query ? `Resultados para “${query}”` : 'Todos os produtos'}</h1></div>
        <p>Estilo, conforto e atitude em cada detalhe.</p>
      </div>
      <div className="catalog-layout">
        <aside className="filter-sidebar">
          <label className="sort-control">Ordenar por
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="">Mais relevantes</option>
              <option value="low">Menor preço</option>
              <option value="high">Maior preço</option>
            </select>
          </label>
          <div className="filters-panel">
            <div className="filters-title"><h2>Filtrar por</h2><button onClick={() => setFilters({ categories: [], genders: [] })}>Limpar</button></div>
            <FilterGroup title="Categoria" options={['Tênis', 'Camisetas', 'Acessórios'].map((value) => ({ text: value, value }))} selected={filters.categories} onChange={(value) => toggleFilter('categories', value)} />
            <FilterGroup title="Público" options={['Masculino', 'Feminino', 'Unissex'].map((value) => ({ text: value, value }))} selected={filters.genders} onChange={(value) => toggleFilter('genders', value)} />
          </div>
        </aside>
        <section className="catalog-results">
          <div className="results-toolbar"><span><strong>{results.length}</strong> produtos encontrados</span><span className="view-label">Exibindo 1-{results.length} de {results.length}</span></div>
          <Section title="" titleAlign="left"><ProductListing products={results} /></Section>
        </section>
      </div>
    </div>
  )
}
