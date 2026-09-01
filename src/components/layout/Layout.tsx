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
  const { pathname, hash } = useLocation()
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
    // Con ancla en la URL manda el efecto de abajo, que baja a la sección.
    if (!hash && prevPagePathRef.current !== null && prevPagePathRef.current !== pagePath) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    }
    prevPagePathRef.current = pagePath
  }, [pathname, hash])

  // Enlaces con ancla (#tour, #tienda…): el router no desplaza por su cuenta.
  // `#?mesa=3` y similares no nombran ninguna sección y se ignoran.
  useEffect(() => {
    const id = hash.replace(/^#/, '').split('?')[0]
    if (!id) return
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
    return () => window.clearTimeout(timer)
  }, [pathname, hash])

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
