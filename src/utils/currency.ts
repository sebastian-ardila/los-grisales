export function formatPrice(price: number | null): string {
  if (price === null) return 'Consultar'
  return `$${price.toLocaleString('es-CO')}`
}
