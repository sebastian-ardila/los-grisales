import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import SedeSelector from '../ui/SedeSelector'
import TableModal from '../table/TableModal'
import CartFloatingBar from '../cart/CartFloatingBar'
import CartDrawer from '../cart/CartDrawer'
import { useSede } from '../../context/SedeContext'
import { useTable } from '../../context/TableContext'
import { useCart } from '../../context/CartContext'

export default function Layout() {
  const { showSelector } = useSede()
  const { showTableModal, setShowTableModal } = useTable()
  const { isCartOpen } = useCart()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {showSelector && <SedeSelector />}

      {showTableModal && (
        <TableModal onClose={() => setShowTableModal(false)} />
      )}

      <Breadcrumb />

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <CartFloatingBar />
      {isCartOpen && <CartDrawer />}

      <Footer />
    </div>
  )
}
