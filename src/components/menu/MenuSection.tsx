import { useState, useRef, useEffect, useCallback } from 'react'
import { allCategories } from '../../data/menu'
import CategoryBar from './CategoryBar'
import CategorySection from './CategorySection'
import { useTranslation } from 'react-i18next'

const NAVBAR_HEIGHT = 64

export default function MenuSection() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('')
  const isScrolling = useRef(false)
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)
  const categoryBarRef = useRef<HTMLDivElement>(null)
  const visibleSections = useRef<Map<string, number>>(new Map())

  const getOffset = useCallback(() => {
    const barHeight = categoryBarRef.current?.offsetHeight || 80
    return NAVBAR_HEIGHT + barHeight + 16
  }, [])

  const setSectionRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      sectionRefs.current.set(id, el)
    } else {
      sectionRefs.current.delete(id)
    }
  }, [])

  const handleCategoryClick = useCallback((categoryId: string) => {
    const el = sectionRefs.current.get(categoryId)
    if (!el) return

    isScrolling.current = true
    setActiveCategory(categoryId)

    const offset = getOffset()
    const top = el.getBoundingClientRect().top + window.scrollY - offset

    window.scrollTo({ top, behavior: 'smooth' })

    setTimeout(() => {
      isScrolling.current = false
    }, 1000)
  }, [getOffset])

  useEffect(() => {
    const sections = Array.from(sectionRefs.current.values())
    if (sections.length === 0) return

    const observerRootMargin = () => {
      const barHeight = categoryBarRef.current?.offsetHeight || 80
      const topInset = NAVBAR_HEIGHT + barHeight
      return `-${topInset}px 0px -20% 0px`
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling.current) return

        for (const entry of entries) {
          const id = entry.target.getAttribute('id')
          if (!id) continue
          if (entry.isIntersecting) {
            visibleSections.current.set(id, entry.intersectionRatio)
          } else {
            visibleSections.current.delete(id)
          }
        }

        if (visibleSections.current.size === 0) {
          setActiveCategory('')
          return
        }

        let bestId = ''
        let bestRatio = 0
        for (const [id, ratio] of visibleSections.current) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        }

        // If ratios are similar, prefer topmost section
        if (bestRatio < 0.1) {
          const offset = getOffset()
          let topMostId = ''
          let topMostDist = Infinity
          for (const [id] of visibleSections.current) {
            const el = sectionRefs.current.get(id)
            if (!el) continue
            const dist = Math.abs(el.getBoundingClientRect().top - offset)
            if (dist < topMostDist) {
              topMostDist = dist
              topMostId = id
            }
          }
          if (topMostId) bestId = topMostId
        }

        if (bestId) setActiveCategory(bestId)
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: observerRootMargin(),
      }
    )

    for (const el of sections) {
      observer.observe(el)
    }

    return () => {
      observer.disconnect()
      visibleSections.current.clear()
    }
  }, [getOffset])

  return (
    <section ref={containerRef} className="py-8">
      <h2 className="text-3xl font-bold text-brand text-center mb-6 px-4">
        {t('menu.title')}
      </h2>

      <div ref={categoryBarRef} className="sticky top-16 z-30">
        <CategoryBar
          categories={allCategories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
      </div>

      <div className="space-y-10 mt-6 max-w-5xl mx-auto px-4">
        {allCategories.map((cat) => (
          <div
            key={cat.id}
            id={cat.id}
            ref={(el) => setSectionRef(cat.id, el)}
          >
            <CategorySection category={cat} id={cat.id} />
          </div>
        ))}
      </div>
    </section>
  )
}
