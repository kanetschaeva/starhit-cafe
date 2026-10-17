import { useState } from 'react'

const sizes = [
  { label: '250 мл', price: 210 },
  { label: '300 мл', price: 250 },
  { label: '400 мл', price: 290 },
]

const milks = [
  { label: 'Обычное', price: 0 },
  { label: 'Овсяное', price: 60 },
  { label: 'Кокосовое', price: 60 },
]

const syrups = [
  { label: 'Без сиропа', price: 0 },
  { label: 'Ваниль', price: 30 },
  { label: 'Карамель', price: 30 },
]
type Favorite = {
  sizeIndex: number
  milkIndex: number
  syrupIndex: number
}

const FAVORITES_KEY = 'starhit-cafe-favorites'

function getFavoriteId(favorite: Favorite) {
  return `${favorite.sizeIndex}-${favorite.milkIndex}-${favorite.syrupIndex}`
}

function loadFavorites(): Favorite[] {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(FAVORITES_KEY) ?? '[]',
    )

    if (!Array.isArray(stored)) return []

    return stored.filter((item): item is Favorite => {
      if (typeof item !== 'object' || item === null) return false

      return (
        Number.isInteger(item.sizeIndex) &&
        item.sizeIndex >= 0 &&
        item.sizeIndex < sizes.length &&
        Number.isInteger(item.milkIndex) &&
        item.milkIndex >= 0 &&
        item.milkIndex < milks.length &&
        Number.isInteger(item.syrupIndex) &&
        item.syrupIndex >= 0 &&
        item.syrupIndex < syrups.length
      )
    })
  } catch {
    return []
  }
}

function App() {
  const [sizeIndex, setSizeIndex] = useState(1)
  const [milkIndex, setMilkIndex] = useState(0)
  const [syrupIndex, setSyrupIndex] = useState(0)
  const [favorites, setFavorites] = useState<Favorite[]>(loadFavorites)
  const [storageError, setStorageError] = useState('')

  function updateFavorites(nextFavorites: Favorite[]) {
    setFavorites(nextFavorites)

    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites))
      setStorageError('')
    } catch {
      setStorageError(
        'Не удалось сохранить избранное в браузере. После обновления страницы изменения могут потеряться.',
      )
    }
  }

  const currentFavorite: Favorite = {
    sizeIndex,
    milkIndex,
    syrupIndex,
  }

  const isSaved = favorites.some(
    (favorite) =>
      getFavoriteId(favorite) === getFavoriteId(currentFavorite),
  )

  function saveFavorite() {
    if (isSaved) return

    updateFavorites([...favorites, currentFavorite])
  }

  function applyFavorite(favorite: Favorite) {
    setSizeIndex(favorite.sizeIndex)
    setMilkIndex(favorite.milkIndex)
    setSyrupIndex(favorite.syrupIndex)
  }

  function removeFavorite(favorite: Favorite) {
    updateFavorites(
      favorites.filter(
        (item) => getFavoriteId(item) !== getFavoriteId(favorite),
      ),
    )
  }
  
  const selectedSize = sizes[sizeIndex]
  const selectedMilk = milks[milkIndex]
  const selectedSyrup = syrups[syrupIndex]

  const totalPrice =
    selectedSize.price + selectedMilk.price + selectedSyrup.price

  const groups = [
    {
      title: 'Объём',
      options: sizes,
      selectedIndex: sizeIndex,
      onSelect: setSizeIndex,
      showExtraPrice: false,
    },
    {
      title: 'Молоко',
      options: milks,
      selectedIndex: milkIndex,
      onSelect: setMilkIndex,
      showExtraPrice: true,
    },
    {
      title: 'Сироп',
      options: syrups,
      selectedIndex: syrupIndex,
      onSelect: setSyrupIndex,
      showExtraPrice: true,
    },
  ]

  return (
    <main className="min-h-screen bg-[#F7F2EA] px-5 py-10 font-sans text-[#49362B]">
      <div className="mx-auto max-w-md">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest">
            StarHit Cafe
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Кофе под твоё настроение
          </h1>
          <p className="mt-3 text-[#756457]">
            Собери свой идеальный капучино.
          </p>
        </header>

        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex h-40 items-center justify-center rounded-2xl bg-[#CDE8DD]">
            <span className="text-7xl" role="img" aria-label="Чашка кофе">
              ☕
            </span>
          </div>

          <h2 className="mt-5 text-2xl font-bold">Капучино</h2>
          <p className="mt-2 leading-relaxed text-[#756457]">
            Эспрессо, тёплое молоко и нежная молочная пена.
          </p>

          <div className="mt-7 space-y-6">
            {groups.map((group) => (
              <fieldset key={group.title}>
                <legend className="mb-3 font-semibold">
                  {group.title}
                </legend>

                <div className="grid grid-cols-3 gap-2">
                  {group.options.map((option, index) => {
                    const isSelected = group.selectedIndex === index

                    return (
                      <button
                        key={option.label}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => group.onSelect(index)}
                        className={`min-h-16 cursor-pointer rounded-2xl border px-2 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#49362B] ${
                          isSelected
                            ? 'border-[#49362B] bg-[#CDE8DD] font-semibold'
                            : 'border-[#E8E0D7] bg-white hover:bg-[#F7F2EA]'
                        }`}
                      >
                        <span className="block">{option.label}</span>

                        {group.showExtraPrice && (
                          <span className="mt-1 block text-xs text-[#756457]">
                            {option.price === 0
                              ? 'Без доплаты'
                              : `+${option.price} ₽`}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-7 border-t border-[#E8E0D7] pt-5">
            <p className="text-sm leading-relaxed text-[#756457]">
              {selectedSize.label} · Молоко: {selectedMilk.label}
              {' · '}
              {selectedSyrup.label}
            </p>

            <div
              className="mt-3 flex items-center justify-between"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="font-semibold">Итого</span>
              <span className="text-3xl font-bold">{totalPrice} ₽</span>
            </div>
          </div>
          <button
            type="button"
            onClick={saveFavorite}
            disabled={isSaved}
            className="mt-6 w-full cursor-pointer rounded-2xl bg-[#49362B] px-4 py-4 font-semibold text-white transition-colors hover:bg-[#624A3B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#49362B] disabled:cursor-default disabled:bg-[#CDE8DD] disabled:text-[#49362B]"
          >
            {isSaved ? '✓ Уже в избранном' : '♡ Сохранить в избранное'}
          </button>
        </article>
        <section className="mt-8" aria-labelledby="favorites-heading">
          <h2 id="favorites-heading" className="text-2xl font-bold">
            Избранное · {favorites.length}
          </h2>

          {storageError && (
            <p role="alert" className="mt-3 text-sm text-[#9B3028]">
              {storageError}
            </p>
          )}

          {favorites.length === 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-[#756457]">
              Здесь появятся твои любимые комбинации. Настрой напиток
              и нажми «Сохранить в избранное».
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {favorites.map((favorite) => {
                const size = sizes[favorite.sizeIndex]
                const milk = milks[favorite.milkIndex]
                const syrup = syrups[favorite.syrupIndex]
                const price = size.price + milk.price + syrup.price

                return (
                  <li
                    key={getFavoriteId(favorite)}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <h3 className="font-bold">Капучино · {size.label}</h3>

                    <p className="mt-1 text-sm text-[#756457]">
                      Молоко: {milk.label} · {syrup.label}
                    </p>

                    <p className="mt-3 text-lg font-bold">{price} ₽</p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => applyFavorite(favorite)}
                        className="min-h-11 cursor-pointer rounded-xl bg-[#CDE8DD] px-4 py-2 text-sm font-semibold hover:bg-[#B9DCCD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#49362B]"
                      >
                        Выбрать
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFavorite(favorite)}
                        aria-label={`Удалить из избранного: капучино, ${size.label}, ${milk.label}, ${syrup.label}`}
                        className="min-h-11 cursor-pointer rounded-xl px-4 py-2 text-sm text-[#756457] hover:bg-[#F7F2EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#49362B]"
                      >
                        Удалить
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
        <p className="mt-5 text-center text-xs text-[#756457]">
          Учебный проект · Напиток и цены для демонстрации
        </p>
      </div>
    </main>
  )
}

export default App