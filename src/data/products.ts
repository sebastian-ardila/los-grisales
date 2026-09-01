import type { Lang } from '../utils/lang'

const BASE = import.meta.env.BASE_URL
const beansImg = `${BASE}products/cafe.webp`
const dripsImg = `${BASE}products/drips.webp`

type T = Record<Lang, string>

/** WhatsApp que atiende los pedidos de la tienda (+57 321 724 3031).
 *  Es distinto al de reservas y contacto, que sale de `config/sedes`. */
export const SHOP_WHATSAPP_NUMBER = '573217243031'

export interface Product {
  key: string
  name: T
  /** Small unit/format badge (e.g. "340 g", "x 8"). */
  unit: T
  process: T
  notes: T[]
  accent: string
  image: string
  /** Spanish-only label used in the WhatsApp order message. */
  orderName: string
}

const beans: Product[] = [
  {
    key: 'cafe-natural-340',
    name: {
      es: 'Café Natural Los Grisales',
      en: 'Natural Coffee Los Grisales',
      fr: 'Café Naturel Los Grisales',
    },
    unit: { es: '340 g', en: '340 g', fr: '340 g' },
    process: { es: 'Natural', en: 'Natural', fr: 'Naturel' },
    accent: '#a04949',
    image: beansImg,
    orderName: 'Café Natural Los Grisales 340 g',
    notes: [
      { es: 'Mora', en: 'Blackberry', fr: 'Mûre' },
      { es: 'Caramelo', en: 'Caramel', fr: 'Caramel' },
      { es: 'Chocolate', en: 'Chocolate', fr: 'Chocolat' },
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
    ],
  },
  {
    key: 'cafe-honey-340',
    name: {
      es: 'Café Honey Los Grisales',
      en: 'Honey Coffee Los Grisales',
      fr: 'Café Honey Los Grisales',
    },
    unit: { es: '340 g', en: '340 g', fr: '340 g' },
    process: { es: 'Honey', en: 'Honey', fr: 'Honey' },
    accent: '#b88539',
    image: beansImg,
    orderName: 'Café Honey Los Grisales 340 g',
    notes: [
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
      { es: 'Cocoa', en: 'Cocoa', fr: 'Cacao' },
      { es: 'Almendra', en: 'Almond', fr: 'Amande' },
      { es: 'Mora', en: 'Blackberry', fr: 'Mûre' },
    ],
  },
  {
    key: 'cafe-lavado-500',
    name: {
      es: 'Café Lavado Los Grisales',
      en: 'Washed Coffee Los Grisales',
      fr: 'Café Lavé Los Grisales',
    },
    unit: { es: '500 g', en: '500 g', fr: '500 g' },
    process: { es: 'Lavado', en: 'Washed', fr: 'Lavé' },
    accent: '#3a7e7a',
    image: beansImg,
    orderName: 'Café Lavado Los Grisales 500 g',
    notes: [
      { es: 'Avellana', en: 'Hazelnut', fr: 'Noisette' },
      { es: 'Chocolate', en: 'Chocolate', fr: 'Chocolat' },
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
      { es: 'Almendra', en: 'Almond', fr: 'Amande' },
    ],
  },
  {
    key: 'cafe-lavado-250',
    name: {
      es: 'Café Lavado Los Grisales',
      en: 'Washed Coffee Los Grisales',
      fr: 'Café Lavé Los Grisales',
    },
    unit: { es: '250 g', en: '250 g', fr: '250 g' },
    process: { es: 'Lavado', en: 'Washed', fr: 'Lavé' },
    accent: '#3a7e7a',
    image: beansImg,
    orderName: 'Café Lavado Los Grisales 250 g',
    notes: [
      { es: 'Avellana', en: 'Hazelnut', fr: 'Noisette' },
      { es: 'Chocolate', en: 'Chocolate', fr: 'Chocolat' },
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
      { es: 'Almendra', en: 'Almond', fr: 'Amande' },
    ],
  },
]

const drips: Product[] = [
  {
    key: 'drip-natural',
    name: {
      es: 'Drips Café Natural Los Grisales',
      en: 'Natural Coffee Drips Los Grisales',
      fr: 'Drips Café Naturel Los Grisales',
    },
    unit: { es: 'Caja x 8', en: 'Box x 8', fr: 'Boîte x 8' },
    process: { es: 'Natural', en: 'Natural', fr: 'Naturel' },
    accent: '#a04949',
    image: dripsImg,
    orderName: 'Drips Café Natural Los Grisales (caja x 8)',
    notes: [
      { es: 'Mora', en: 'Blackberry', fr: 'Mûre' },
      { es: 'Caramelo', en: 'Caramel', fr: 'Caramel' },
      { es: 'Chocolate', en: 'Chocolate', fr: 'Chocolat' },
    ],
  },
  {
    key: 'drip-honey',
    name: {
      es: 'Drips Café Honey Los Grisales',
      en: 'Honey Coffee Drips Los Grisales',
      fr: 'Drips Café Honey Los Grisales',
    },
    unit: { es: 'Caja x 8', en: 'Box x 8', fr: 'Boîte x 8' },
    process: { es: 'Honey', en: 'Honey', fr: 'Honey' },
    accent: '#b88539',
    image: dripsImg,
    orderName: 'Drips Café Honey Los Grisales (caja x 8)',
    notes: [
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
      { es: 'Cocoa', en: 'Cocoa', fr: 'Cacao' },
      { es: 'Almendra', en: 'Almond', fr: 'Amande' },
    ],
  },
  {
    key: 'drip-lavado',
    name: {
      es: 'Drips Café Lavado Los Grisales',
      en: 'Washed Coffee Drips Los Grisales',
      fr: 'Drips Café Lavé Los Grisales',
    },
    unit: { es: 'Caja x 8', en: 'Box x 8', fr: 'Boîte x 8' },
    process: { es: 'Lavado', en: 'Washed', fr: 'Lavé' },
    accent: '#3a7e7a',
    image: dripsImg,
    orderName: 'Drips Café Lavado Los Grisales (caja x 8)',
    notes: [
      { es: 'Avellana', en: 'Hazelnut', fr: 'Noisette' },
      { es: 'Chocolate', en: 'Chocolate', fr: 'Chocolat' },
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
    ],
  },
]

/** Catálogo de café que se muestra en la tienda de la home. */
export const allProducts: Product[] = [...beans, ...drips]
