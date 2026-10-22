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
  { id: 'breakfast', name: 'Завтраки' },
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

export const products: Product[] = [
  {
    id: 'cappuccino',
    name: 'Капучино',
    categoryId: 'classic',
    variants: drinkVariants([99, 179, 209, 239]),
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
    fixedProduct(`frappe-${id}`, `Айс фраппе: ${name}`, 'frappe', 249, '400 мл'),
  ),

  fixedProduct('oatmeal', 'Каша овсяная', 'breakfast', 129),
  fixedProduct('rice-porridge', 'Каша рисовая', 'breakfast', 129),
  fixedProduct('syrniki', 'Сырники', 'breakfast', 199),
  fixedProduct('pancakes-ham-cheese', 'Блины с ветчиной и сыром', 'breakfast', 199),
  fixedProduct('pancakes-cottage-cheese', 'Блины с творогом', 'breakfast', 199),

  ...[
    ['twister-chicken-ham', 'Твистер с ветчиной из курицы'],
    ['bagel-ham-tomato', 'Бейгл с ветчиной и вялеными томатами'],
    ['bagel-chicken', 'Бейгл с курицей'],
    ['puff-turkey-bbq', 'Сэндвич на слоёном хлебе с индейкой и барбекю'],
    ['puff-salmon', 'Сэндвич на слоёном хлебе с горбушей'],
    ['puff-ham', 'Сэндвич с ветчиной на слоёном хлебе'],
    ['puff-beef-aioli', 'Сэндвич с говядиной и соусом айоли на слоёном хлебе'],
    ['puff-turkey-pastrami', 'Сэндвич с пастрами из индейки с горчичным соусом'],
    ['roll-chicken-blue-cheese', 'Сэндвич-ролл с курицей и соусом «Блючиз»'],
    ['roll-turkey', 'Сэндвич-ролл с индейкой'],
    ['roll-caesar', 'Сэндвич-ролл «Цезарь» с курицей'],
    ['sandwich-ham', 'Сэндвич с ветчиной'],
    ['sandwich-chicken', 'Сэндвич с курицей'],
  ].map(([id, name]) =>
    fixedProduct(id, name, 'sandwiches', 299),
  ),

  fixedProduct('profiterole', 'Профитроль', 'desserts', 59),
  fixedProduct('potato-cake', 'Пирожное «Картошка»', 'desserts', 59),

  fixedProduct('donut', 'Пончик в ассортименте', 'desserts', 89),
  fixedProduct('strudel-apple', 'Штрудель с яблоком', 'desserts', 89),
  fixedProduct('strudel-cherry', 'Штрудель с вишней', 'desserts', 89),

  fixedProduct('cookies', 'Печенье в ассортименте', 'desserts', 149),
  fixedProduct('cheesecake-classic', 'Чизкейк классический', 'desserts', 149),
  fixedProduct('eclair-napoleon', 'Эклер «Наполеон»', 'desserts', 149),
  fixedProduct('eclair-chocolate', 'Эклер шоколадный', 'desserts', 149),
  fixedProduct('eclair-tiramisu', 'Эклер «Тирамису»', 'desserts', 149),
  fixedProduct('eclair-dubai', 'Эклер «Дубайский»', 'desserts', 149),

  fixedProduct('honey-cake', 'Медовое пирожное', 'desserts', 189),
  fixedProduct('carrot-cake', 'Морковное пирожное', 'desserts', 189),
  fixedProduct('cheesecake-dulce', 'Чизкейк дульче де лече', 'desserts', 189),
  fixedProduct('brownie', 'Пирожное брауни', 'desserts', 189),
  fixedProduct('lemon-tart', 'Тарталетка лимонная', 'desserts', 189),
  fixedProduct('cookie-peanut', 'Шоколадное печенье с арахисовой пастой', 'desserts', 189),
  fixedProduct('cheesecake-basque', 'Баскский чизкейк', 'desserts', 189),

  fixedProduct('parfait', 'Парфе в ассортименте', 'desserts', 199),

  fixedProduct('cheesecake-brownie', 'Чизкейк брауни с карамелью', 'desserts', 249),
  fixedProduct('tart-snickers', 'Тарталетка «Сникерс»', 'desserts', 249),
  fixedProduct('chocolate-cake', 'Шоколадный торт со сгущёнкой', 'desserts', 249),
  fixedProduct('caramel-cake', 'Карамельно-песочный торт', 'desserts', 249),
]

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
  { id: 'soy-banana', name: 'Соевое банановое', price: 49 },
  { id: 'hazelnut', name: 'Фундучное', price: 49 },
  { id: 'oat', name: 'Овсяное', price: 49 },
  { id: 'lactose-free', name: 'Безлактозное', price: 49 },
]

export const alternativeMilkVolumeIds = ['200', '300']

export const drinkExtras = [
  { id: 'cream-cheese', name: 'Кремчиз', price: 59 },
  { id: 'espresso-shot', name: 'Дополнительный шот эспрессо, 30 мл', price: 59 },
  { id: 'whipped-cream', name: 'Взбитые сливки с топпингом', price: 59 },
  { id: 'citrus', name: 'Цитрусы', price: 59 },
  { id: 'marshmallow', name: 'Маршмеллоу', price: 59 },
]

export const foodExtras = [
  { id: 'sour-cream', name: 'Сметана', price: 19 },
  { id: 'ketchup', name: 'Кетчуп', price: 19 },
  { id: 'honey', name: 'Мёд', price: 19 },
  { id: 'topping', name: 'Топпинг в ассортименте', price: 19 },
]