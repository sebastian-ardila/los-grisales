import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SedeProvider } from './context/SedeContext'
import { TableProvider } from './context/TableContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/layout/Layout'
import LangRedirect from './components/layout/LangRedirect'
import HomePage from './pages/HomePage'
import ReservationsPage from './pages/ReservationsPage'
import SchedulePage from './pages/SchedulePage'
import HistoryPage from './pages/HistoryPage'
import ContactPage from './pages/ContactPage'

export default function App() {
  return (
    <SedeProvider>
      <TableProvider>
        <CartProvider>
          <HashRouter>
            <Routes>
              {/* Redirect root to /:lang */}
              <Route path="/" element={<LangRedirect />} />

              {/* Routes with language prefix */}
              <Route path="/:lang" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="carta" element={<HomePage />} />
                <Route path="reservas" element={<ReservationsPage />} />
                <Route path="horarios" element={<SchedulePage />} />
                <Route path="historia" element={<HistoryPage />} />
                <Route path="contacto" element={<ContactPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </CartProvider>
      </TableProvider>
    </SedeProvider>
  )
}
