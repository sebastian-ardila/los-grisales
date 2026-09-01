import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { SedeProvider } from './context/SedeContext'
import { TableProvider } from './context/TableContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/layout/Layout'
import LangRedirect from './components/layout/LangRedirect'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'

const BlogListPage = lazy(() => import('./pages/BlogListPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))

/** La tienda vive ahora en la home: /:lang/productos conserva el enlace y
 *  lleva a la sección #tienda. */
function ProductsRedirect() {
  const { lang } = useParams()
  const target = lang === 'en' || lang === 'fr' ? lang : 'es'
  return <Navigate to={`/${target}#tienda`} replace />
}

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
                <Route path="productos" element={<ProductsRedirect />} />
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
