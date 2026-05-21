import { useEffect, useRef } from 'react'
import { Outlet, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  const { lang } = useParams()
  const { pathname } = useLocation()
  const { i18n } = useTranslation()

  // Sync i18n language with URL param
  useEffect(() => {
    if (lang && (lang === 'es' || lang === 'en' || lang === 'fr')) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang)
      }
    }
  }, [lang, i18n])

  // Scroll to top only when navigating to a different page, NOT when only the
  // language prefix changes (so the language switcher preserves scroll position).
  const prevPagePathRef = useRef<string | null>(null)
  useEffect(() => {
    const stripLang = (p: string) => p.replace(/^\/(es|en|fr)/, '') || '/'
    const pagePath = stripLang(pathname)
    if (prevPagePathRef.current !== null && prevPagePathRef.current !== pagePath) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    }
    prevPagePathRef.current = pagePath
  }, [pathname])

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
