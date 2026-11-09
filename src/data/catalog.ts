export type CategoryId =
  | 'classic'
  | 'frappe'
  | 'breakfast'
  | 'sandwiches'
  | 'desserts'

export type Product = {
  id: string
  name: string
  categoryId: CategoryId
  variants: {
    id: string
    label: string
    price: number
  }[]
}

export const categories: { id: CategoryId; name: string }[] = [
  { id: 'classic', name: 'Классика' },
  { id: 'frappe', name: 'Айс фраппе' },
  { id: 'breakfast', name: 'Завтраки и блюда' },
  { id: 'sandwiches', name: 'Сэндвичи' },
  { id: 'desserts', name: 'Десерты' },
]

function drinkVariants(prices: [number, number, number, number]) {
  return [200, 300, 400, 600].map((volume, index) => ({
    id: `${volume}`,
    label: `${volume} мл`,
    price: prices[index],
  }))
}

function fixedProduct(
  id: string,
  name: string,
  categoryId: CategoryId,
  price: number,
  label = 'Порция',
): Product {
  return {
    id,
    name,
    categoryId,
    variants: [{ id: 'standard', label, price }],
  }
}

// Каталог прототипа собран по фотографиям меню и приложения.
// Цены и наличие могут отличаться между кофейнями.
// Для позиций без новой рублёвой цены сохранены прежние демоцены.
export const products: Product[] = [
  {
    id: 'cappuccino',
    name: 'Капучино',
    categoryId: 'classic',
    variants: drinkVariants([139, 199, 239, 279]),
  },
  {
    id: 'latte',
    name: 'Латте',
    categoryId: 'classic',
    variants: drinkVariants([109, 189, 219, 249]),
  },
  {
    id: 'americano',
    name: 'Американо',
    categoryId: 'classic',
    variants: drinkVariants([79, 159, 199, 219]),
  },
  {
    id: 'flat-white',
    name: 'Флэт уайт',
    categoryId: 'classic',
    variants: [
      { id: '200', label: '200 мл', price: 129 },
      { id: '400', label: '400 мл', price: 249 },
    ],
  },

  ...[
    ['raspberry', 'Малина'],
    ['pistachio-matcha-raspberry', 'Фисташковая матча с малиной'],
    ['matcha', 'Матча'],
    ['salted-caramel', 'Солёная карамель'],
    ['cracker-caramel', 'Солёный крекер с карамелью'],
    ['vanilla', 'Ваниль'],
    ['chocolate', 'Шоколад'],
    ['banana', 'Банан'],
    ['bubble-gum', 'Бабл-гам'],
    ['strawberry', 'Клубника'],
  ].map(([id, name]) =>
    fixedProduct(
      `frappe-${id}`,
      `Айс фраппе: ${name}`,
      'frappe',
      249,
      '400 мл',
    ),
  ),

  fixedProduct('oatmeal', 'Каша овсяная', 'breakfast', 129),
  fixedProduct('rice-porridge', 'Каша рисовая', 'breakfast', 129),
  fixedProduct('syrniki', 'Сырники', 'breakfast', 199),
  fixedProduct(
    'pancakes-ham-cheese',
    'Блинчики с ветчиной и сыром',
    'breakfast',
    199,
  ),
  fixedProduct(
    'pancakes-cottage-cheese',
    'Блинчики с творогом',
    'breakfast',
    199,
  ),
  fixedProduct(
    'vareniki-potato',
    'Вареники с картофелем',
    'breakfast',
    249,
  ),
  fixedProduct(
    'chicken-cutlet-pasta',
    'Куриная котлета с макаронами',
    'breakfast',
    279,
  ),
  fixedProduct(
    'battered-chicken-mash',
    'Курица в кляре с картофельным пюре',
    'breakfast',
    279,
  ),
  fixedProduct('vinaigrette', 'Винегрет', 'breakfast', 159),
  fixedProduct('pelmeni', 'Пельмени ручной лепки', 'breakfast', 279),
  fixedProduct('vitamin-salad', 'Салат витаминный', 'breakfast', 139),

  fixedProduct('bagel-chicken', 'Бейгл с курицей', 'sandwiches', 279),
  fixedProduct(
    'puff-ham',
    'Сэндвич с ветчиной на слоёном хлебе',
    'sandwiches',
    239,
  ),

  ...[
    ['twister-chicken-ham', 'Твистер с ветчиной из курицы'],
    ['bagel-ham-tomato', 'Бейгл с ветчиной и вялеными томатами'],
    ['puff-turkey-bbq', 'Сэндвич на слоёном хлебе с индейкой и барбекю'],
    ['puff-salmon', 'Сэндвич на слоёном хлебе с горбушей'],
    ['puff-beef-aioli', 'Сэндвич с говядиной и соусом айоли на слоёном хлебе'],
    ['puff-turkey-pastrami', 'Сэндвич с пастрами из индейки с горчичным соусом'],
    ['roll-chicken-blue-cheese', 'Сэндвич-ролл с курицей и соусом «Блючиз»'],
    ['roll-turkey', 'Сэндвич-ролл с индейкой'],
    ['roll-caesar', 'Сэндвич-ролл «Цезарь» с курицей'],
    ['sandwich-ham', 'Сэндвич с ветчиной'],
    ['sandwich-chicken', 'Сэндвич с курицей'],
  ].map(([id, name]) => fixedProduct(id, name, 'sandwiches', 299)),

  fixedProduct('profiterole', 'Профитроль со сливками', 'desserts', 69),
  fixedProduct('potato-cake', 'Пирожное «Картошка»', 'desserts', 59),
  fixedProduct('cheesecake-classic', 'Чизкейк классический', 'desserts', 149),
  fixedProduct('eclair-napoleon', 'Эклер «Наполеон»', 'desserts', 169),
  fixedProduct('eclair-chocolate', 'Эклер шоколадный', 'desserts', 169),
  fixedProduct('eclair-tiramisu', 'Эклер «Тирамису»', 'desserts', 179),
  fixedProduct(
    'eclair-dubai',
    'Эклер «Дубайский шоколад», фисташковый',
    'desserts',
    179,
  ),
  fixedProduct('honey-cake', 'Медовое пирожное', 'desserts', 179),
  fixedProduct('carrot-cake', 'Морковное пирожное', 'desserts', 179),
  fixedProduct('cheesecake-dulce', 'Чизкейк дульче де лече', 'desserts', 169),
  fixedProduct('brownie', 'Пирожное брауни', 'desserts', 199),
  fixedProduct(
    'cookie-peanut',
    'Шоколадное печенье с арахисовой пастой',
    'desserts',
    179,
  ),
  fixedProduct('cheesecake-basque', 'Баскский чизкейк', 'desserts', 199),
  fixedProduct(
    'cheesecake-brownie',
    'Чизкейк с брауни и карамелью',
    'desserts',
    239,
  ),
  fixedProduct('tart-snickers', 'Тарт «Сникерс»', 'desserts', 239),
  fixedProduct(
    'chocolate-cake',
    'Шоколадный торт со сгущёнкой',
    'desserts',
    239,
  ),
  fixedProduct(
    'caramel-cake',
    'Карамельно-песочный торт',
    'desserts',
    239,
  ),
  fixedProduct('tart-raspberry', 'Тарт с малиной', 'desserts', 249),
  fixedProduct(
    'cookie-coconut-orange',
    'Печенье кокос-апельсин',
    'desserts',
    139,
  ),

  fixedProduct('donut', 'Пончик в ассортименте', 'desserts', 89),
  fixedProduct('strudel-apple', 'Штрудель с яблоком', 'desserts', 89),
  fixedProduct('strudel-cherry', 'Штрудель с вишней', 'desserts', 89),
  fixedProduct('cookies', 'Печенье в ассортименте', 'desserts', 149),
  fixedProduct('lemon-tart', 'Тарталетка лимонная', 'desserts', 189),
  fixedProduct('parfait', 'Парфе в ассортименте', 'desserts', 199),
]

// Актуальная стоимость сиропа по объёму рассчитывается в drinkConfig.ts.
// Поле price оставлено для совместимости с прежними данными.
export const syrups = [
  { id: 'mint', name: 'Мятный', price: 12 },
  { id: 'banana', name: 'Банановый', price: 12 },
  { id: 'vanilla', name: 'Ванильный', price: 12 },
  { id: 'chocolate', name: 'Шоколадный', price: 12 },
  { id: 'nut', name: 'Ореховый', price: 12 },
  { id: 'chocolate-cookie', name: 'Шоколадное печенье', price: 12 },
  { id: 'bergamot', name: 'Бергамот', price: 12 },
  { id: 'caramel', name: 'Карамель', price: 12 },
  { id: 'salted-caramel', name: 'Солёная карамель', price: 12 },
  { id: 'bubble-gum', name: 'Бабл-гам', price: 12 },
]

export const alternativeMilks = [
  { id: 'coconut', name: 'Кокосовое', price: 49 },
  { id: 'soy', name: 'Соевое', price: 49 },
  { id: 'soy-banana', name: 'Банановое', price: 49 },
  { id: 'hazelnut', name: 'Фундучное', price: 49 },
  { id: 'oat', name: 'Овсяное', price: 49 },
  { id: 'lactose-free', name: 'Безлактозное', price: 49 },
]

export const alternativeMilkVolumeIds = ['200', '300']

export const drinkExtras = [
  { id: 'cream-cheese', name: 'Кремчиз', price: 69 },
  {
    id: 'espresso-shot',
    name: 'Дополнительный шот эспрессо, 30 мл',
    price: 59,
  },
  { id: 'whipped-cream', name: 'Взбитые сливки', price: 69 },
  {
    id: 'whipped-cream-chocolate',
    name: 'Взбитые сливки с шоколадным топпингом',
    price: 69,
  },
  {
    id: 'whipped-cream-caramel',
    name: 'Взбитые сливки с карамельным топпингом',
    price: 69,
  },
  {
    id: 'whipped-cream-raspberry',
    name: 'Взбитые сливки с малиновым топпингом',
    price: 69,
  },
  { id: 'citrus', name: 'Цитрусы', price: 59 },
  { id: 'marshmallow', name: 'Маршмеллоу', price: 59 },
]

export const foodExtras = [
  { id: 'sour-cream', name: 'Сметана', price: 19 },
  { id: 'ketchup', name: 'Кетчуп', price: 19 },
  { id: 'honey', name: 'Мёд', price: 19 },
  { id: 'topping', name: 'Топпинг в ассортименте', price: 19 },
]