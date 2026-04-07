import type { MenuCategory, MenuItem } from './types'

function item(id: string, nameEs: string, nameEn: string, price: number | null, ingredients: string[], opts?: {
  volumeLabel?: string
  descEs?: string
  descEn?: string
  steps?: string[]
  isVegetarian?: boolean
  categoryId?: string
}): MenuItem {
  return {
    id,
    name: { es: nameEs, en: nameEn },
    price,
    ingredients,
    volumeLabel: opts?.volumeLabel,
    description: opts?.descEs ? { es: opts.descEs, en: opts.descEn || opts.descEs } : undefined,
    steps: opts?.steps,
    isVegetarian: opts?.isVegetarian || false,
    categoryId: opts?.categoryId || '',
  }
}

// ─── TIENDA ───
const tienda: MenuItem[] = [
  item('tienda-cafe-grano-libra', 'Café en Grano - Libra', 'Whole Bean Coffee - Pound', null, ['☕ Café de especialidad de origen'], { volumeLabel: '500g Grano entero' }),
  item('tienda-cafe-molido-libra', 'Café Molido - Libra', 'Ground Coffee - Pound', null, ['☕ Café de especialidad de origen'], { volumeLabel: '500g Molido' }),
  item('tienda-cafe-grano-media', 'Café en Grano - Media', 'Whole Bean Coffee - Half', null, ['☕ Café de especialidad de origen'], { volumeLabel: '250g Grano entero' }),
  item('tienda-cafe-molido-media', 'Café Molido - Media', 'Ground Coffee - Half', null, ['☕ Café de especialidad de origen'], { volumeLabel: '250g Molido' }),
  item('tienda-cafe-honey', 'Café Honey', 'Honey Process Coffee', null, ['☕ Café proceso honey'], { volumeLabel: '340g Proceso Honey' }),
  item('tienda-cafe-natural', 'Café Natural', 'Natural Process Coffee', null, ['☕ Café proceso natural'], { volumeLabel: '340g Proceso Natural' }),
  item('tienda-drip', 'Drip de Café Molido', 'Coffee Drip Bag', null, ['☕ Café molido en bolsa drip'], { volumeLabel: '1 unidad Molido' }),
]

// ─── DESAYUNOS ───
const desayunos: MenuItem[] = [
  item('desayunos-omelette', 'Omelette', 'Omelette', 20000, ['🥚 Huevos', '🧀 Relleno a elección']),
  item('desayunos-fruta', 'Fruta de Temporada', 'Seasonal Fruit', 13000, ['🍓 Frutas frescas de temporada'], { volumeLabel: '1 porción', isVegetarian: true }),
  item('desayunos-bowl-frutas', 'Bowl de Frutas', 'Fruit Bowl', 14000, ['🍇 Mix de frutas frescas'], { volumeLabel: '1 bowl', isVegetarian: true }),
  item('desayunos-waffle-pandebono', 'Waffle Pandebono con Huevos', 'Pandebono Waffle with Eggs', 24000, ['🧇 Masa de pandebono', '🥚 Huevos'], { descEs: 'Waffle hecho con masa de pandebono acompañado de huevos', descEn: 'Waffle made with pandebono dough served with eggs' }),
  item('desayunos-waffle-frutas', 'Waffle de Frutas', 'Fruit Waffle', 18000, ['🧇 Masa de waffle', '🍓 Frutas frescas', '🍫 Topping'], { isVegetarian: true }),
  item('desayunos-tostada', 'Tostada Masa Madre', 'Sourdough Toast', 17000, ['🍞 Pan masa madre', '🥑 Acompañamiento'], { isVegetarian: true }),
]

// ─── ENTRADAS ───
const entradas: MenuItem[] = [
  item('entradas-pastel', 'Pastel', 'Pastry', 4500, ['🥟 Masa hojaldre', '🥩 Relleno de carne o pollo'], { volumeLabel: '1 unidad', descEs: 'Elige entre carne o pollo', descEn: 'Choose beef or chicken' }),
  item('entradas-pandebono', 'Pandebono', 'Pandebono', 8000, ['🧀 Almidón de yuca', '🧀 Queso costeño', '🥛 Cuajada'], { volumeLabel: '1 unidad', isVegetarian: true }),
  item('entradas-empanadas', 'Empanadas x6', 'Empanadas x6', 13000, ['🌽 Masa de maíz', '🥩 Relleno a elección'], { volumeLabel: '6 unidades', descEs: 'Elige entre carne, queso o pollo', descEn: 'Choose beef, cheese or chicken' }),
  item('entradas-nachos', 'Nachos con Salsas', 'Nachos with Sauces', 15000, ['🌮 Totopos de maíz', '🫙 Salsas variadas'], { volumeLabel: '1 porción', isVegetarian: true }),
  item('entradas-dedo-queso', 'Dedo de Queso', 'Cheese Stick', 8000, ['🧀 Queso', '🍞 Masa crujiente'], { volumeLabel: '1 porción', isVegetarian: true }),
  item('entradas-croissant', 'Croissant Mantequilla', 'Butter Croissant', 8000, ['🥐 Masa hojaldre', '🧈 Mantequilla francesa'], { volumeLabel: '1 unidad', isVegetarian: true }),
]

// ─── PA' TARDEAR ───
const paTardear: MenuItem[] = [
  item('tardear-sandwich', 'Sándwich de Pollo', 'Chicken Sandwich', 20000, ['🍞 Pan artesanal', '🍗 Pollo', '🥬 Vegetales', '🫙 Salsa']),
  item('tardear-mini-burguers', 'Mini Burguers', 'Mini Burgers', 26000, ['🍔 Mini panes', '🥩 Carne', '🧀 Queso', '🫙 Salsas'], { descEs: 'Set de mini hamburguesas', descEn: 'Set of mini burgers' }),
  item('tardear-pizza-pollo', 'Pizza de Pollo', 'Chicken Pizza', 38000, ['🍕 Masa artesanal', '🍅 Salsa de tomate', '🧀 Queso mozzarella', '🍗 Pollo'], { volumeLabel: '1 pizza' }),
  item('tardear-pizza-quesos', 'Pizza de Quesos', 'Cheese Pizza', 36000, ['🍕 Masa artesanal', '🍅 Salsa de tomate', '🧀 Mix de quesos'], { volumeLabel: '1 pizza', isVegetarian: true }),
]

// ─── POSTRES ───
const postres: MenuItem[] = [
  item('postres-cheesecake', 'Cheesecake', 'Cheesecake', 17000, ['🧀 Queso crema', '🍪 Base de galleta', '🍓 Topping'], { volumeLabel: '1 porción', isVegetarian: true }),
  item('postres-almojabana', 'Torta de Almojábana', 'Almojábana Cake', 13000, ['🧀 Almojábana', '🍦 Crema'], { volumeLabel: '1 porción', isVegetarian: true }),
  item('postres-zanahoria', 'Torta de Zanahoria', 'Carrot Cake', 14000, ['🥕 Zanahoria', '🌾 Harina', '🧀 Frosting de queso crema'], { volumeLabel: '1 porción', isVegetarian: true }),
  item('postres-rollo-canela', 'Rollo de Canela', 'Cinnamon Roll', 6000, ['🍩 Masa dulce', '🫚 Canela', '🍬 Glaseado'], { volumeLabel: '1 unidad', isVegetarian: true }),
  item('postres-croissant-relleno', 'Croissant Relleno', 'Filled Croissant', 13000, ['🥐 Masa hojaldre', '🥜 Relleno de pistacho o Nutella'], { volumeLabel: '1 unidad', descEs: 'Elige entre pistacho o Nutella', descEn: 'Choose pistachio or Nutella' }),
  item('postres-galleta-rellena', 'Galleta Rellena', 'Filled Cookie', 11000, ['🍪 Galleta artesanal', '🥜 Relleno de pistacho o Nutella'], { volumeLabel: '1 unidad', descEs: 'Elige entre pistacho o Nutella', descEn: 'Choose pistachio or Nutella' }),
]

// ─── MÉTODOS DE PREPARACIÓN ───
const metodos: MenuItem[] = [
  item('metodos-lavado', 'Método x2 Tazas - Lavado', 'Brew Method x2 Cups - Washed', 21000, ['☕ Café de especialidad lavado'], { volumeLabel: '2 tazas Lavado', descEs: 'Elige método: Chemex, V60, Aeropress o Fretta (frío)', descEn: 'Choose method: Chemex, V60, Aeropress or Fretta (cold)' }),
  item('metodos-honey', 'Método x2 Tazas - Honey', 'Brew Method x2 Cups - Honey', 27000, ['☕ Café de especialidad proceso honey'], { volumeLabel: '2 tazas Honey', descEs: 'Elige método: Chemex, V60, Aeropress o Fretta (frío)', descEn: 'Choose method: Chemex, V60, Aeropress or Fretta (cold)' }),
  item('metodos-natural', 'Método x2 Tazas - Natural', 'Brew Method x2 Cups - Natural', 27000, ['☕ Café de especialidad proceso natural'], { volumeLabel: '2 tazas Natural', descEs: 'Elige método: Chemex, V60, Aeropress o Fretta (frío)', descEn: 'Choose method: Chemex, V60, Aeropress or Fretta (cold)' }),
]

// ─── BEBIDAS DE CAFÉ - CALIENTES ───
const cafeCaliente: MenuItem[] = [
  item('cafe-cal-espresso', 'Espresso', 'Espresso', 7000, ['☕ Café espresso'], { volumeLabel: '30ml' }),
  item('cafe-cal-doppio', 'Espresso Doppio', 'Espresso Doppio', 10000, ['☕ Doble shot espresso'], { volumeLabel: '60ml' }),
  item('cafe-cal-americano', 'Americano', 'Americano', 7000, ['☕ Espresso', '💧 Agua caliente'], { volumeLabel: '200ml' }),
  item('cafe-cal-latte', 'Latte', 'Latte', 9000, ['☕ Espresso', '🥛 Leche vaporizada'], { volumeLabel: '300ml' }),
  item('cafe-cal-latte-vainilla', 'Latte Vainilla', 'Vanilla Latte', 10000, ['☕ Espresso', '🥛 Leche vaporizada', '🌿 Sirope de vainilla'], { volumeLabel: '300ml' }),
  item('cafe-cal-latte-hershey', 'Latte Hershey & Chantilly', 'Hershey Latte & Chantilly', 14000, ['☕ Espresso', '🥛 Leche', '🍫 Chocolate Hershey\'s', '🍦 Crema chantilly'], { volumeLabel: '350ml' }),
  item('cafe-cal-capuchino', 'Capuchino', 'Cappuccino', 10000, ['☕ Espresso', '🥛 Leche vaporizada', '☁️ Espuma de leche'], { volumeLabel: '250ml' }),
  item('cafe-cal-capuchino-vainilla', 'Capuchino Vainilla', 'Vanilla Cappuccino', 12000, ['☕ Espresso', '🥛 Leche vaporizada', '☁️ Espuma', '🌿 Sirope de vainilla'], { volumeLabel: '250ml' }),
  item('cafe-cal-mocachino', 'Mocachino', 'Mocha', 11000, ['☕ Espresso', '🥛 Leche', '🍫 Chocolate'], { volumeLabel: '300ml' }),
  item('cafe-cal-mocachino-hershey', 'Mocachino Hershey\'s & Chantilly', 'Hershey\'s Mocha & Chantilly', 14000, ['☕ Espresso', '🥛 Leche', '🍫 Chocolate Hershey\'s', '🍦 Crema chantilly'], { volumeLabel: '350ml' }),
  item('cafe-cal-bombon', 'Café Bombón', 'Café Bombón', 8000, ['☕ Espresso', '🥛 Leche condensada'], { volumeLabel: '120ml' }),
  item('cafe-cal-macchiato', 'Café Macchiato', 'Café Macchiato', 8000, ['☕ Espresso', '☁️ Espuma de leche'], { volumeLabel: '90ml' }),
  item('cafe-cal-irlandes', 'Café Irlandés', 'Irish Coffee', 18000, ['☕ Espresso', '🥃 Whisky irlandés', '🍦 Crema batida'], { volumeLabel: '250ml' }),
  item('cafe-cal-carajillo', 'Carajillo', 'Carajillo', 12000, ['☕ Espresso', '🥃 Licor (Baileys o aguardiente)'], { volumeLabel: '120ml' }),
  item('cafe-cal-campesino', 'Campesino', 'Campesino', 8000, ['☕ Café colado tradicional', '🍯 Panela'], { volumeLabel: '250ml' }),
  item('cafe-cal-capuchino-licor', 'Capuchino con Licor', 'Liquor Cappuccino', 16000, ['☕ Espresso', '🥛 Leche', '☁️ Espuma', '🥃 Licor a elección'], { volumeLabel: '300ml', descEs: 'Elige entre Amaretto o Crema de Whisky', descEn: 'Choose Amaretto or Cream Whisky' }),
]

// ─── BEBIDAS DE CAFÉ - FRÍAS ───
const cafeFrio: MenuItem[] = [
  item('cafe-frio-moka-granizado', 'Moka Granizado', 'Mocha Frappe', 13000, ['☕ Espresso', '🍫 Chocolate', '🧊 Hielo', '🥛 Leche'], { volumeLabel: '350ml' }),
  item('cafe-frio-malteada', 'Malteada de Café', 'Coffee Milkshake', 14000, ['☕ Espresso', '🍦 Helado', '🥛 Leche'], { volumeLabel: '400ml' }),
  item('cafe-frio-cafe-frio', 'Café Frío', 'Iced Coffee', 8000, ['☕ Café frío', '🧊 Hielo'], { volumeLabel: '300ml' }),
  item('cafe-frio-affogato', 'Café Affogato', 'Affogato', 14000, ['☕ Espresso caliente', '🍦 Helado de vainilla'], { volumeLabel: '200ml' }),
  item('cafe-frio-latte-frio', 'Café Latte Frío', 'Iced Latte', 13000, ['☕ Espresso', '🥛 Leche fría', '🧊 Hielo'], { volumeLabel: '350ml' }),
  item('cafe-frio-latte-fresa', 'Café Latte Fresa', 'Strawberry Latte', 15000, ['☕ Espresso', '🥛 Leche', '🍓 Sirope de fresa', '🧊 Hielo'], { volumeLabel: '350ml' }),
  item('cafe-frio-cold-brew', 'Cold Brew', 'Cold Brew', 12000, ['☕ Café infusionado en frío 12h'], { volumeLabel: '350ml' }),
  item('cafe-frio-espresso-tonic', 'Espresso Tonic', 'Espresso Tonic', 15000, ['☕ Espresso', '🫧 Agua tónica', '🧊 Hielo'], { volumeLabel: '300ml' }),
  item('cafe-frio-espresso-orange', 'Espresso Orange', 'Espresso Orange', 14000, ['☕ Espresso', '🍊 Jugo de naranja', '🧊 Hielo'], { volumeLabel: '300ml' }),
  item('cafe-frio-limonada-cafe', 'Limonada de Café', 'Coffee Lemonade', 12000, ['☕ Cold brew', '🍋 Limonada natural'], { volumeLabel: '350ml' }),
  item('cafe-frio-latte-hershey', 'Latte Frío Hershey\'s', 'Iced Hershey\'s Latte', 15000, ['☕ Espresso', '🥛 Leche fría', '🍫 Chocolate Hershey\'s', '🧊 Hielo'], { volumeLabel: '350ml' }),
  item('cafe-frio-granizado', 'Granizado de Café', 'Coffee Granita', 13000, ['☕ Café', '🧊 Hielo granizado'], { volumeLabel: '350ml' }),
  item('cafe-frio-moka-ice', 'Moka Ice', 'Mocha Ice', 14000, ['☕ Espresso', '🍫 Chocolate', '🥛 Leche fría', '🧊 Hielo'], { volumeLabel: '350ml' }),
]

// ─── CÓCTELES DE CAFÉ ───
const coctelesCafe: MenuItem[] = [
  item('coctel-cafe-pina-colada', 'Piña Colada de Café', 'Coffee Piña Colada', 33000, ['☕ Espresso', '🥃 Ron', '🥥 Crema de coco', '🍍 Piña'], { volumeLabel: '350ml' }),
  item('coctel-cafe-espresso-martini', 'Espresso Martini', 'Espresso Martini', 31000, ['☕ Espresso', '🍸 Vodka', '🥃 Licor de café'], { volumeLabel: '200ml' }),
  item('coctel-cafe-frappe-whisky', 'Frappé Crema de Whisky', 'Whisky Cream Frappé', 29000, ['☕ Espresso', '🥃 Crema de whisky', '🧊 Hielo'], { volumeLabel: '350ml' }),
  item('coctel-cafe-mojito', 'Mojito Café', 'Coffee Mojito', 30000, ['☕ Cold brew', '🥃 Ron', '🌿 Hierbabuena', '🍋 Limón'], { volumeLabel: '350ml' }),
  item('coctel-cafe-montana', 'Café Montaña', 'Mountain Coffee', 29000, ['☕ Espresso', '🥃 Licor', '🍦 Crema'], { volumeLabel: '300ml' }),
  item('coctel-cafe-nevado', 'Café Nevado', 'Snowy Coffee', 30000, ['☕ Espresso', '🥃 Licor', '☁️ Espuma fría'], { volumeLabel: '300ml' }),
  item('coctel-cafe-bosque', 'Café del Bosque', 'Forest Coffee', 29000, ['☕ Espresso', '🥃 Licor herbal', '🌿 Aromáticas'], { volumeLabel: '300ml' }),
  item('coctel-cafe-gin-tonic', 'Cold Brew Gin Tonic', 'Cold Brew Gin Tonic', 30000, ['☕ Cold brew', '🍸 Ginebra', '🫧 Agua tónica'], { volumeLabel: '350ml' }),
  item('coctel-cafe-amaretto', 'Espresso Amaretto', 'Espresso Amaretto', 28000, ['☕ Espresso', '🥃 Amaretto'], { volumeLabel: '200ml' }),
]

// ─── BEBIDAS CALIENTES (SIN CAFÉ) ───
const bebidasCalientes: MenuItem[] = [
  item('cal-milo', 'Milo Caliente', 'Hot Milo', 10000, ['🍫 Milo', '🥛 Leche caliente'], { volumeLabel: '300ml', isVegetarian: true }),
  item('cal-chocolate-leche', 'Chocolate con Leche', 'Hot Chocolate with Milk', 9000, ['🍫 Chocolate', '🥛 Leche'], { volumeLabel: '300ml', isVegetarian: true }),
  item('cal-chocolate', 'Chocolate', 'Hot Chocolate', 7000, ['🍫 Chocolate en agua'], { volumeLabel: '250ml', isVegetarian: true }),
  item('cal-colada', 'Colada', 'Colada', 10000, ['🌾 Avena', '🥛 Leche', '🫚 Canela'], { volumeLabel: '300ml', isVegetarian: true }),
  item('cal-te-chai', 'Té Chai Caliente', 'Hot Chai Tea', 10000, ['🫖 Té chai', '🥛 Leche', '🫚 Especias'], { volumeLabel: '300ml', isVegetarian: true }),
  item('cal-aromatica-frutos', 'Aromática de Frutos', 'Fruit Herbal Tea', 9000, ['🍓 Frutos deshidratados', '💧 Agua caliente'], { volumeLabel: '300ml', isVegetarian: true }),
  item('cal-aromatica-jengibre', 'Aromática de Jengibre', 'Ginger Tea', 7000, ['🫚 Jengibre fresco', '💧 Agua caliente'], { volumeLabel: '300ml', isVegetarian: true }),
  item('cal-infusion-jengibre', 'Infusión Jengibre & Hierbabuena', 'Ginger & Mint Infusion', 6000, ['🫚 Jengibre', '🌿 Hierbabuena', '💧 Agua caliente'], { volumeLabel: '300ml', isVegetarian: true }),
  item('cal-aromatica-panelita', 'Aromática Panelita', 'Panela Tea', 5000, ['🍯 Panela', '💧 Agua caliente', '🍋 Limón'], { volumeLabel: '300ml', isVegetarian: true }),
  item('cal-aromatica-hierbabuena', 'Aromática Hierbabuena', 'Mint Tea', 9000, ['🌿 Hierbabuena fresca', '💧 Agua caliente'], { volumeLabel: '300ml', isVegetarian: true }),
  item('cal-infusion-cascara', 'Infusión Cáscara de Café', 'Coffee Husk Infusion', 7000, ['☕ Cáscara de café de especialidad', '💧 Agua caliente'], { volumeLabel: '300ml', isVegetarian: true }),
]

// ─── CÓCTELES CLÁSICOS - PREMIUM ───
const coctelesPremium: MenuItem[] = [
  item('coctel-prem-tom-collins', 'Tom Collins', 'Tom Collins', 31000, ['🍸 Gin', '🍋 Limón', '🫧 Soda', '🍬 Azúcar'], { volumeLabel: '350ml' }),
  item('coctel-prem-tequila-sunrise', 'Tequila Sunrise', 'Tequila Sunrise', 31000, ['🥃 Tequila', '🍊 Jugo de naranja', '🍒 Granadina'], { volumeLabel: '350ml' }),
  item('coctel-prem-caipirinha', 'Caipirinha', 'Caipirinha', 31000, ['🥃 Cachaça', '🍋 Limón', '🍬 Azúcar', '🧊 Hielo'], { volumeLabel: '300ml' }),
  item('coctel-prem-daiquiri', 'Daiquirí de Fresa', 'Strawberry Daiquiri', 30000, ['🥃 Ron', '🍓 Fresa', '🍋 Limón', '🍬 Azúcar'], { volumeLabel: '300ml' }),
  item('coctel-prem-martini', 'Martini', 'Martini', 33000, ['🍸 Vodka/Gin', '🍒 Lychee o fresa'], { volumeLabel: '200ml', descEs: 'Elige entre lychee o fresa', descEn: 'Choose lychee or strawberry' }),
  item('coctel-prem-negroni', 'Negroni', 'Negroni', 32000, ['🍸 Gin', '🍷 Campari', '🍷 Vermouth rojo'], { volumeLabel: '200ml' }),
  item('coctel-prem-pina-colada', 'Piña Colada', 'Piña Colada', 32000, ['🥃 Ron', '🥥 Crema de coco', '🍍 Piña'], { volumeLabel: '350ml' }),
  item('coctel-prem-long-island', 'Long Island Ice Tea', 'Long Island Ice Tea', 38000, ['🍸 Vodka', '🥃 Ron', '🍸 Gin', '🥃 Tequila', '🍊 Triple sec', '🥤 Cola'], { volumeLabel: '400ml' }),
  item('coctel-prem-moscow-mule', 'Moscow Mule', 'Moscow Mule', 34000, ['🍸 Vodka', '🫚 Ginger beer', '🍋 Limón'], { volumeLabel: '350ml' }),
]

// ─── CÓCTELES CLÁSICOS ───
const coctelesClasicos: MenuItem[] = [
  item('coctel-mojito', 'Mojito', 'Mojito', 31000, ['🥃 Ron', '🌿 Hierbabuena', '🍋 Limón', '🫧 Soda'], { volumeLabel: '350ml', descEs: 'Elige entre fresa o maracuyá', descEn: 'Choose strawberry or passion fruit' }),
  item('coctel-margarita', 'Margarita', 'Margarita', 32000, ['🥃 Tequila', '🍊 Triple sec', '🍋 Limón'], { volumeLabel: '300ml', descEs: 'Elige entre fresa o maracuyá', descEn: 'Choose strawberry or passion fruit' }),
  item('coctel-gin-tonic', 'Gin Tonic', 'Gin Tonic', 31000, ['🍸 Ginebra', '🫧 Agua tónica', '🌿 Botánicos'], { volumeLabel: '350ml' }),
  item('coctel-dry-martini', 'Dry Martini', 'Dry Martini', 31000, ['🍸 Gin', '🍷 Vermouth seco', '🫒 Aceituna'], { volumeLabel: '200ml' }),
  item('coctel-destornillador', 'Destornillador', 'Screwdriver', 33000, ['🍸 Vodka', '🍊 Jugo de naranja'], { volumeLabel: '350ml' }),
  item('coctel-sex-beach', 'Sex on the Beach', 'Sex on the Beach', 33000, ['🍸 Vodka', '🍑 Durazno', '🍊 Naranja', '🫐 Arándano'], { volumeLabel: '350ml' }),
  item('coctel-orgasmo', 'Orgasmo', 'Orgasm', 34000, ['🥃 Amaretto', '🥃 Baileys', '🥃 Kahlúa'], { volumeLabel: '250ml' }),
]

// ─── CÓCTELES SIN LICOR ───
const coctelesSinLicor: MenuItem[] = [
  item('coctel-sin-mojito', 'Mojito Sin Alcohol', 'Virgin Mojito', 15000, ['🌿 Hierbabuena', '🍋 Limón', '🫧 Soda', '🍬 Azúcar'], { volumeLabel: '350ml', isVegetarian: true }),
  item('coctel-sin-pina-colada', 'Piña Colada Sin Alcohol', 'Virgin Piña Colada', 22000, ['🥥 Crema de coco', '🍍 Piña', '🧊 Hielo'], { volumeLabel: '350ml', isVegetarian: true }),
  item('coctel-sin-mojito-espresso', 'Mojito Espresso Sin Alcohol', 'Virgin Espresso Mojito', 16000, ['☕ Espresso', '🌿 Hierbabuena', '🍋 Limón', '🫧 Soda'], { volumeLabel: '350ml' }),
]

// ─── LIMONADAS ───
const limonadas: MenuItem[] = [
  item('limonada-vino', 'Limonada de Vino', 'Wine Lemonade', 17000, ['🍷 Vino', '🍋 Limón', '🍬 Azúcar'], { volumeLabel: '400ml' }),
  item('limonada-coco', 'Limonada de Coco', 'Coconut Lemonade', 13000, ['🥥 Leche de coco', '🍋 Limón'], { volumeLabel: '400ml', isVegetarian: true }),
  item('limonada-natural', 'Limonada Natural', 'Natural Lemonade', 8000, ['🍋 Limón', '💧 Agua', '🍬 Azúcar'], { volumeLabel: '400ml', isVegetarian: true }),
  item('limonada-mango', 'Limonada Mango & Hierbabuena', 'Mango Mint Lemonade', 11000, ['🥭 Mango', '🍋 Limón', '🌿 Hierbabuena'], { volumeLabel: '400ml', isVegetarian: true }),
  item('limonada-hierbabuena', 'Limonada Hierbabuena', 'Mint Lemonade', 8000, ['🍋 Limón', '🌿 Hierbabuena'], { volumeLabel: '400ml', isVegetarian: true }),
  item('limonada-mandarino', 'Limonada Limón Mandarino', 'Mandarin Lemonade', 8000, ['🍊 Limón mandarino', '💧 Agua'], { volumeLabel: '400ml', isVegetarian: true }),
  item('limonada-jengibre', 'Limonada Hierbabuena & Jengibre', 'Mint Ginger Lemonade', 11000, ['🍋 Limón', '🌿 Hierbabuena', '🫚 Jengibre'], { volumeLabel: '400ml', isVegetarian: true }),
  item('limonada-cherry', 'Limonada Cherry', 'Cherry Lemonade', 12000, ['🍋 Limón', '🍒 Cereza'], { volumeLabel: '400ml', isVegetarian: true }),
]

// ─── SODAS & GASEOSAS ───
const sodasGaseosas: MenuItem[] = [
  item('soda-agua-hatsu', 'Agua Hatsu', 'Hatsu Water', 7000, ['💧 Agua premium'], { volumeLabel: '1 botella', isVegetarian: true }),
  item('soda-te-hatsu', 'Té Hatsu', 'Hatsu Tea', 10000, ['🫖 Té Hatsu'], { volumeLabel: '1 botella', isVegetarian: true }),
  item('soda-bretana', 'Soda Bretaña', 'Bretaña Soda', 7000, ['🫧 Soda Bretaña clásica'], { volumeLabel: '1 botella', isVegetarian: true }),
  item('soda-ginger', 'Ginger Canada Dry', 'Canada Dry Ginger Ale', 7000, ['🫧 Ginger ale'], { volumeLabel: '1 lata', isVegetarian: true }),
  item('soda-tamarindo', 'Tamarindo Postobón', 'Tamarind Postobón', 7000, ['🥤 Refresco de tamarindo'], { volumeLabel: '1 botella', isVegetarian: true }),
  item('soda-gaseosa', 'Gaseosa', 'Soft Drink', 7000, ['🥤 Gaseosa a elección'], { volumeLabel: '1 botella', isVegetarian: true }),
  item('soda-bretana-frutal', 'Soda Bretaña Frutal', 'Fruity Bretaña Soda', 8000, ['🫧 Soda Bretaña sabor durazno o lychee'], { volumeLabel: '1 botella', descEs: 'Elige entre durazno o lychee', descEn: 'Choose peach or lychee', isVegetarian: true }),
  item('soda-bretana-saborizada', 'Soda Bretaña Saborizada', 'Flavored Bretaña Soda', 7000, ['🫧 Soda Bretaña saborizada'], { volumeLabel: '1 botella', descEs: 'Elige entre fresa, maracuyá o mango', descEn: 'Choose strawberry, passion fruit or mango', isVegetarian: true }),
]

// ─── FRÍAS & JUGOS ───
const friasJugos: MenuItem[] = [
  item('frias-malteada', 'Malteada', 'Milkshake', 14000, ['🍦 Helado', '🥛 Leche', '🍓 Sabor a elección'], { volumeLabel: '400ml', isVegetarian: true }),
  item('frias-milo-frio', 'Milo Frío', 'Iced Milo', 12000, ['🍫 Milo', '🥛 Leche fría', '🧊 Hielo'], { volumeLabel: '350ml', isVegetarian: true }),
  item('frias-te-chai', 'Té Chai Frío', 'Iced Chai Tea', 12000, ['🫖 Té chai', '🥛 Leche fría', '🧊 Hielo'], { volumeLabel: '350ml', isVegetarian: true }),
  item('frias-jugo-agua', 'Jugo en Agua', 'Juice in Water', 9000, ['🍊 Fruta natural', '💧 Agua'], { volumeLabel: '400ml', isVegetarian: true }),
  item('frias-jugo-leche', 'Jugo en Leche', 'Juice in Milk', 10000, ['🍊 Fruta natural', '🥛 Leche'], { volumeLabel: '400ml', isVegetarian: true }),
]

// ─── MICHELADAS ───
const micheladas: MenuItem[] = [
  item('michelada-clasica', 'Michelado', 'Michelada', 15000, ['🍺 Cerveza', '🍋 Limón', '🫙 Salsa', '🧂 Sal'], { volumeLabel: '1 vaso' }),
  item('michelada-mango', 'Michelado + Mango', 'Mango Michelada', 14000, ['🍺 Cerveza', '🥭 Mango', '🍋 Limón', '🫙 Salsa', '🧂 Sal'], { volumeLabel: '1 vaso' }),
  item('michelada-tajin', 'Michelado + Tajín', 'Tajín Michelada', 14000, ['🍺 Cerveza', '🌶️ Tajín', '🍋 Limón', '🫙 Salsa'], { volumeLabel: '1 vaso' }),
]

// ─── LICORES - VINOS ───
const vinos: MenuItem[] = [
  item('vino-cabernet-botella', 'Vino Cabernet - Botella', 'Cabernet Wine - Bottle', 88000, ['🍷 Vino Cabernet Sauvignon'], { volumeLabel: '750ml' }),
  item('vino-cabernet-media', 'Vino Cabernet - Media', 'Cabernet Wine - Half', 51000, ['🍷 Vino Cabernet Sauvignon'], { volumeLabel: '375ml' }),
  item('vino-cabernet-piba', 'Vino Cabernet - Piba', 'Cabernet Wine - Small', 28000, ['🍷 Vino Cabernet Sauvignon'], { volumeLabel: '187ml' }),
  item('vino-sauvignon-botella', 'Vino Sauvignon - Botella', 'Sauvignon Wine - Bottle', 88000, ['🍷 Vino Sauvignon Blanc'], { volumeLabel: '750ml' }),
  item('vino-sauvignon-media', 'Vino Sauvignon - Media', 'Sauvignon Wine - Half', 51000, ['🍷 Vino Sauvignon Blanc'], { volumeLabel: '375ml' }),
  item('vino-sauvignon-piba', 'Vino Sauvignon - Piba', 'Sauvignon Wine - Small', 28000, ['🍷 Vino Sauvignon Blanc'], { volumeLabel: '187ml' }),
  item('vino-blanco-botella', 'Vino Blanco - Botella', 'White Wine - Bottle', 88000, ['🍷 Vino Blanco'], { volumeLabel: '750ml' }),
  item('vino-blanco-media', 'Vino Blanco - Media', 'White Wine - Half', 51000, ['🍷 Vino Blanco'], { volumeLabel: '375ml' }),
  item('vino-blanco-piba', 'Vino Blanco - Piba', 'White Wine - Small', 28000, ['🍷 Vino Blanco'], { volumeLabel: '187ml' }),
]

// ─── LICORES - WHISKY ───
const whisky: MenuItem[] = [
  item('whisky-buchanans-botella', "Buchanan's - Botella", "Buchanan's - Bottle", 400000, ["🥃 Buchanan's"], { volumeLabel: '750ml' }),
  item('whisky-buchanans-media', "Buchanan's - Media", "Buchanan's - Half", 230000, ["🥃 Buchanan's"], { volumeLabel: '375ml' }),
  item('whisky-buchanans-trago', "Buchanan's - Trago", "Buchanan's - Shot", 33000, ["🥃 Buchanan's"], { volumeLabel: '45ml' }),
  item('whisky-old-parr-botella', 'Old Parr - Botella', 'Old Parr - Bottle', 380000, ['🥃 Old Parr'], { volumeLabel: '750ml' }),
  item('whisky-old-parr-media', 'Old Parr - Media', 'Old Parr - Half', 270000, ['🥃 Old Parr'], { volumeLabel: '375ml' }),
  item('whisky-old-parr-trago', 'Old Parr - Trago', 'Old Parr - Shot', 33000, ['🥃 Old Parr'], { volumeLabel: '45ml' }),
  item('whisky-jack-daniels', "Jack Daniel's - Trago", "Jack Daniel's - Shot", 33000, ["🥃 Jack Daniel's"], { volumeLabel: '45ml' }),
]

// ─── LICORES - TEQUILAS ───
const tequilas: MenuItem[] = [
  item('tequila-cuervo-botella', 'José Cuervo - Botella', 'José Cuervo - Bottle', 230000, ['🥃 José Cuervo'], { volumeLabel: '750ml' }),
  item('tequila-cuervo-media', 'José Cuervo - Media', 'José Cuervo - Half', 150000, ['🥃 José Cuervo'], { volumeLabel: '375ml' }),
  item('tequila-cuervo-trago', 'José Cuervo - Trago', 'José Cuervo - Shot', 22000, ['🥃 José Cuervo'], { volumeLabel: '45ml' }),
  item('tequila-don-julio', 'Don Julio Blanco - Botella', 'Don Julio Blanco - Bottle', 450000, ['🥃 Don Julio Blanco'], { volumeLabel: '750ml' }),
  item('tequila-jimador-botella', 'Jimador - Botella', 'Jimador - Bottle', 250000, ['🥃 Jimador'], { volumeLabel: '750ml' }),
  item('tequila-jimador-media', 'Jimador - Media', 'Jimador - Half', 190000, ['🥃 Jimador'], { volumeLabel: '375ml' }),
  item('tequila-jimador-trago', 'Jimador - Trago', 'Jimador - Shot', 28000, ['🥃 Jimador'], { volumeLabel: '45ml' }),
]

// ─── LICORES - VODKA ───
const vodka: MenuItem[] = [
  item('vodka-absolut-botella', 'Absolut - Botella', 'Absolut - Bottle', 230000, ['🍸 Absolut'], { volumeLabel: '750ml' }),
  item('vodka-absolut-media', 'Absolut - Media', 'Absolut - Half', 150000, ['🍸 Absolut'], { volumeLabel: '375ml' }),
  item('vodka-absolut-trago', 'Absolut - Trago', 'Absolut - Shot', 22000, ['🍸 Absolut'], { volumeLabel: '45ml' }),
]

// ─── LICORES - GINEBRA ───
const ginebra: MenuItem[] = [
  item('ginebra-tanqueray-botella', 'Tanqueray - Botella', 'Tanqueray - Bottle', 130000, ['🍸 Tanqueray'], { volumeLabel: '750ml' }),
  item('ginebra-tanqueray-media', 'Tanqueray - Media', 'Tanqueray - Half', 80000, ['🍸 Tanqueray'], { volumeLabel: '375ml' }),
  item('ginebra-tanqueray-trago', 'Tanqueray - Trago', 'Tanqueray - Shot', 28000, ['🍸 Tanqueray'], { volumeLabel: '45ml' }),
]

// ─── LICORES - RON ───
const ron: MenuItem[] = [
  item('ron-caldas-3-trago', 'Ron Caldas 3 Años - Trago', 'Ron Caldas 3yr - Shot', 19000, ['🥃 Ron Caldas 3 Años'], { volumeLabel: '45ml' }),
  item('ron-caldas-8-botella', 'Ron Caldas 8 Años - Botella', 'Ron Caldas 8yr - Bottle', 190000, ['🥃 Ron Caldas 8 Años'], { volumeLabel: '750ml' }),
  item('ron-caldas-8-media', 'Ron Caldas 8 Años - Media', 'Ron Caldas 8yr - Half', 110000, ['🥃 Ron Caldas 8 Años'], { volumeLabel: '375ml' }),
  item('ron-caldas-8-trago', 'Ron Caldas 8 Años - Trago', 'Ron Caldas 8yr - Shot', 40000, ['🥃 Ron Caldas 8 Años'], { volumeLabel: '45ml' }),
]

// ─── LICORES - AGUARDIENTE ───
const aguardiente: MenuItem[] = [
  item('aguardiente-amarillo-botella', 'Aguardiente Amarillo - Botella', 'Aguardiente Amarillo - Bottle', 120000, ['🥃 Aguardiente Amarillo'], { volumeLabel: '750ml' }),
  item('aguardiente-amarillo-media', 'Aguardiente Amarillo - Media', 'Aguardiente Amarillo - Half', 70000, ['🥃 Aguardiente Amarillo'], { volumeLabel: '375ml' }),
  item('aguardiente-amarillo-trago', 'Aguardiente Amarillo - Trago', 'Aguardiente Amarillo - Shot', 18000, ['🥃 Aguardiente Amarillo'], { volumeLabel: '45ml' }),
  item('aguardiente-azul-media', 'Aguardiente Tapa Azul - Media', 'Aguardiente Tapa Azul - Half', 46000, ['🥃 Aguardiente Tapa Azul'], { volumeLabel: '375ml' }),
  item('aguardiente-azul-botella', 'Aguardiente Tapa Azul - Botella', 'Aguardiente Tapa Azul - Bottle', 80000, ['🥃 Aguardiente Tapa Azul'], { volumeLabel: '750ml' }),
]

// ─── CERVEZAS ARTESANALES ───
const cervezasArtesanales: MenuItem[] = [
  item('cerveza-3c-rosada', '3 Cordilleras Rosada', '3 Cordilleras Rosé', 13000, ['🍺 Cerveza artesanal rosada'], { volumeLabel: '1 botella' }),
  item('cerveza-3c-negra', '3 Cordilleras Negra', '3 Cordilleras Dark', 13000, ['🍺 Cerveza artesanal negra'], { volumeLabel: '1 botella' }),
  item('cerveza-3c-mulata', '3 Cordilleras Mulata', '3 Cordilleras Mulata', 13000, ['🍺 Cerveza artesanal mulata'], { volumeLabel: '1 botella' }),
]

// ─── CERVEZAS IMPORTADAS ───
const cervezasImportadas: MenuItem[] = [
  item('cerveza-heineken', 'Heineken', 'Heineken', 12000, ['🍺 Heineken'], { volumeLabel: '1 botella' }),
  item('cerveza-sol', 'Sol', 'Sol', 12000, ['🍺 Sol'], { volumeLabel: '1 botella' }),
  item('cerveza-stella', 'Stella Artois', 'Stella Artois', 12000, ['🍺 Stella Artois'], { volumeLabel: '1 botella' }),
  item('cerveza-corona', 'Corona', 'Corona', 12000, ['🍺 Corona'], { volumeLabel: '1 botella' }),
]

// ─── CERVEZAS NACIONALES ───
const cervezasNacionales: MenuItem[] = [
  item('cerveza-club-dorada', 'Club Dorada', 'Club Dorada', 11000, ['🍺 Club Dorada'], { volumeLabel: '1 botella' }),
  item('cerveza-club-negra', 'Club Negra', 'Club Negra', 11000, ['🍺 Club Negra'], { volumeLabel: '1 botella' }),
]

// ─── BUILD CATEGORIES ───
function buildCategory(id: string, nameEs: string, nameEn: string, emoji: string, icon: string, sortOrder: number, categoryItems: MenuItem[]): MenuCategory {
  const items = categoryItems.map(i => ({ ...i, categoryId: id }))
  return { id, name: { es: nameEs, en: nameEn }, emoji, icon, sortOrder, items }
}

export const categories: MenuCategory[] = [
  buildCategory('tienda', 'Tienda', 'Shop', '🛍️', 'Storefront', 1, tienda),
  buildCategory('desayunos', 'Desayunos', 'Breakfast', '🍳', 'Egg', 2, desayunos),
  buildCategory('entradas', 'Entradas', 'Starters', '🧀', 'ForkKnife', 3, entradas),
  buildCategory('pa-tardear', "Pa' Tardear", 'Afternoon Bites', '🥪', 'SunHorizon', 4, paTardear),
  buildCategory('postres', 'Postres', 'Desserts', '🍰', 'IceCream', 5, postres),
  buildCategory('metodos', 'Métodos de Preparación', 'Brew Methods', '☕', 'Funnel', 6, metodos),
  buildCategory('cafe-caliente', 'Café Caliente', 'Hot Coffee', '☕', 'Coffee', 7, cafeCaliente),
  buildCategory('cafe-frio', 'Café Frío', 'Iced Coffee', '🧊', 'Snowflake', 8, cafeFrio),
  buildCategory('cocteles-cafe', 'Cócteles de Café', 'Coffee Cocktails', '🍸', 'Martini', 9, coctelesCafe),
  buildCategory('bebidas-calientes', 'Bebidas Calientes', 'Hot Drinks', '🫖', 'TeaBag', 10, bebidasCalientes),
  buildCategory('cocteles-premium', 'Cócteles Premium', 'Premium Cocktails', '🍸', 'Champagne', 11, coctelesPremium),
  buildCategory('cocteles-clasicos', 'Cócteles Clásicos', 'Classic Cocktails', '🍹', 'Cocktail', 12, coctelesClasicos),
  buildCategory('cocteles-sin-licor', 'Cócteles Sin Licor', 'Non-Alcoholic Cocktails', '🍹', 'OrangeSlice', 13, coctelesSinLicor),
  buildCategory('limonadas', 'Limonadas', 'Lemonades', '🍋', 'OrangeSlice', 14, limonadas),
  buildCategory('sodas-gaseosas', 'Sodas & Gaseosas', 'Sodas & Soft Drinks', '🥤', 'Drop', 15, sodasGaseosas),
  buildCategory('frias-jugos', 'Frías & Jugos', 'Cold Drinks & Juices', '🥤', 'Orange', 16, friasJugos),
  buildCategory('micheladas', 'Micheladas', 'Micheladas', '🍺', 'BeerBottle', 17, micheladas),
  buildCategory('vinos', 'Vinos', 'Wines', '🍷', 'Wine', 18, vinos),
  buildCategory('whisky', 'Whisky', 'Whisky', '🥃', 'Drop', 19, whisky),
  buildCategory('tequilas', 'Tequilas', 'Tequilas', '🥃', 'Drop', 20, tequilas),
  buildCategory('vodka', 'Vodka', 'Vodka', '🍸', 'Snowflake', 21, vodka),
  buildCategory('ginebra', 'Ginebra', 'Gin', '🍸', 'Leaf', 22, ginebra),
  buildCategory('ron', 'Ron', 'Rum', '🥃', 'Drop', 23, ron),
  buildCategory('aguardiente', 'Aguardiente', 'Aguardiente', '🥃', 'Fire', 24, aguardiente),
  buildCategory('cervezas-artesanales', 'Cervezas Artesanales', 'Craft Beers', '🍺', 'BeerStein', 25, cervezasArtesanales),
  buildCategory('cervezas-importadas', 'Cervezas Importadas', 'Imported Beers', '🍺', 'Globe', 26, cervezasImportadas),
  buildCategory('cervezas-nacionales', 'Cervezas Nacionales', 'National Beers', '🍺', 'Flag', 27, cervezasNacionales),
]

// ─── VEGETARIANO (computed) ───
const allItems = categories.flatMap(c => c.items)
const vegetarianItems = allItems.filter(i => i.isVegetarian)

export const vegetarianCategory: MenuCategory = {
  id: 'vegetariano',
  name: { es: 'Vegetariano', en: 'Vegetarian' },
  emoji: '🌿',
  icon: 'Plant',
  sortOrder: 28,
  items: vegetarianItems,
}

export const allCategories: MenuCategory[] = [...categories, vegetarianCategory]

export const allMenuItems: MenuItem[] = allItems
