import { useRef, useCallback } from 'react'
import HeroSection from '../components/home/HeroSection'
import MenuSection from '../components/menu/MenuSection'

export default function HomePage() {
  const menuRef = useRef<HTMLDivElement>(null)

  const scrollToMenu = useCallback(() => {
    if (menuRef.current) {
      const navHeight = 64
      const offset = navHeight + 20
      const top = menuRef.current.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  return (
    <>
      <HeroSection onViewMenu={scrollToMenu} />
      <div ref={menuRef}>
        <MenuSection />
      </div>
    </>
  )
}
