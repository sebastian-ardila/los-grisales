import { describe, it, expect } from 'vitest'
import { sedes, visibleSedes } from './sedes'

describe('sedes visibles', () => {
  it('Pereira Plaza está oculta tras el cierre temporal', () => {
    expect(sedes['pereira-plaza'].hidden).toBe(true)
    expect(visibleSedes.map((s) => s.id)).not.toContain('pereira-plaza')
  })

  it('quedan Unicentro y el Coffee Tour', () => {
    expect(visibleSedes.map((s) => s.id)).toEqual(['unicentro', 'coffee-tour'])
  })

  it('la configuración de la sede oculta se conserva para no romper referencias', () => {
    expect(sedes['pereira-plaza'].whatsappNumber).toBeTruthy()
  })
})
