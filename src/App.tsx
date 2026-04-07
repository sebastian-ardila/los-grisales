import { HashRouter, Routes, Route } from 'react-router-dom'
import { SedeProvider } from './context/SedeContext'
import { TableProvider } from './context/TableContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/layout/Layout'
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
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/carta" element={<HomePage />} />
                <Route path="/reservas" element={<ReservationsPage />} />
                <Route path="/horarios" element={<SchedulePage />} />
                <Route path="/historia" element={<HistoryPage />} />
                <Route path="/contacto" element={<ContactPage />} />
              </Route>
            </Routes>
          </HashRouter>
        </CartProvider>
      </TableProvider>
    </SedeProvider>
  )
}
