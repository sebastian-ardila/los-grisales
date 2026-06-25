import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HeroNoticeCard from './HeroNoticeCard'

function renderCard(props: Partial<React.ComponentProps<typeof HeroNoticeCard>> = {}) {
  return render(
    <MemoryRouter>
      <HeroNoticeCard
        lang="es"
        href="/es/blog/mi-post"
        title="Sostenibilidad real"
        description="Somos Negocios Verdes certificados por la CARDER"
        date="2026-06-25"
        {...props}
      />
    </MemoryRouter>,
  )
}

describe('HeroNoticeCard', () => {
  it('muestra título, descripción y enlaza al post', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /sostenibilidad real/i })
    expect(link).toHaveAttribute('href', '/es/blog/mi-post')
    expect(screen.getByText('Somos Negocios Verdes certificados por la CARDER')).toBeInTheDocument()
  })

  it('muestra la fecha formateada localizada', () => {
    renderCard()
    // La fecha se renderiza en la variante móvil y en la de escritorio.
    expect(screen.getAllByText(/25 de junio de 2026/i).length).toBeGreaterThan(0)
  })

  it('renderiza la imagen de fondo cuando se pasa image', () => {
    renderCard({ image: '/blog/x/cover.webp' })
    const img = screen.getByTestId('hero-cover-image')
    expect(img).toHaveAttribute('src', '/blog/x/cover.webp')
  })
})
