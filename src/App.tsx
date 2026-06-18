import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { SedeProvider } from './context/SedeContext'
import { TableProvider } from './context/TableContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/layout/Layout'
import LangRedirect from './components/layout/LangRedirect'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import ProductsPage from './pages/ProductsPage'

const BlogListPage = lazy(() => import('./pages/BlogListPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))

export default function App() {
  return (
    <SedeProvider>
      <TableProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Redirect root to /:lang */}
              <Route path="/" element={<LangRedirect />} />

              {/* Routes with language prefix */}
              <Route path="/:lang" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="historia" element={<HistoryPage />} />
                <Route path="productos" element={<ProductsPage />} />
                <Route path="blog" element={<Suspense fallback={null}><BlogListPage /></Suspense>} />
                <Route path="blog/:slug" element={<Suspense fallback={null}><BlogPostPage /></Suspense>} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TableProvider>
    </SedeProvider>
  )
}
