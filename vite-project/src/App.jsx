import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductListingPage from './pages/ProductListingPage.jsx'
import ProductViewPage from './pages/ProductViewPage.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductViewPage />} />
          <Route path="/categories" element={<ProductListingPage />} />
          <Route path="/my-orders" element={<ProductListingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
