// Maps menu item ids → dish image filename in /public/dishes/
// Items not listed here render the placeholder icon in ProductCard.

const ITEM_IMAGE: Record<string, string> = {
  // café caliente (con imagen)
  'cafe-cal-espresso': 'espresso',
  'cafe-cal-doppio': 'espresso',
  'cafe-cal-americano': 'americano',
  'cafe-cal-latte': 'latte',
  'cafe-cal-latte-vainilla': 'latte',
  'cafe-cal-latte-hershey': 'mocha',
  'cafe-cal-capuchino': 'cappuccino',
  'cafe-cal-capuchino-vainilla': 'cappuccino',
  'cafe-cal-mocachino': 'mocha',
  'cafe-cal-mocachino-hershey': 'mocha',
  'cafe-cal-bombon': 'espresso',
  'cafe-cal-macchiato': 'cappuccino',
  'cafe-cal-carajillo': 'espresso',
  'cafe-cal-capuchino-licor': 'cappuccino',

  // café frío (solo los autorizados)
  'cafe-frio-moka-granizado': 'frappe',
  'cafe-frio-malteada': 'milo',
  'cafe-frio-affogato': 'affogato',
  'cafe-frio-espresso-tonic': 'gin',

  // entradas (solo croissant)
  'entradas-croissant': 'croissant',

  // pa' tardear (todos)
  'tardear-sandwich': 'sandwich',
  'tardear-mini-burguers': 'burger',
  'tardear-pizza-pollo': 'pizza',
  'tardear-pizza-quesos': 'pizza',

  // postres (solo rollo canela y croissant relleno)
  'postres-rollo-canela': 'cinnamon-roll',
  'postres-croissant-relleno': 'croissant',

  // bebidas calientes (solo Milo)
  'cal-milo': 'milo',
}

export function getDishImage(itemId: string): string | null {
  const slug = ITEM_IMAGE[itemId]
  return slug ? `dishes/${slug}.webp` : null
}
