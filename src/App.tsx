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

type Screen = 'menu' | 'favorites' | 'loyalty'

const screens: { id: Screen; label: string }[] = [
  { id: 'menu', label: 'Меню' },
  { id: 'favorites', label: 'Избранное' },
  { id: 'loyalty', label: 'Бонусы' },
]

const FAVORITES_KEY = 'starhit-cafe-favorites'

function getFavoriteId(favorite: Favorite) {
  return `${favorite.sizeIndex}-${favorite.milkIndex}-${favorite.syrupIndex}`
}

function isValidIndex(value: unknown, length: number): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value < length
  )
}

function isFavorite(value: unknown): value is Favorite {
  if (typeof value !== 'object' || value === null) return false

  return (
    'sizeIndex' in value &&
    isValidIndex(value.sizeIndex, sizes.length) &&
    'milkIndex' in value &&
    isValidIndex(value.milkIndex, milks.length) &&
    'syrupIndex' in value &&
    isValidIndex(value.syrupIndex, syrups.length)
  )
}

function loadFavorites(): Favorite[] {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(FAVORITES_KEY) ?? '[]',
    )

    if (!Array.isArray(stored)) return []

    return stored.filter(isFavorite)
  } catch {
    return []
  }
}

function App() {
  const [screen, setScreen] = useState<Screen>('menu')
  const [showQrNotice, setShowQrNotice] = useState(false)

  const [sizeIndex, setSizeIndex] = useState(1)
  const [milkIndex, setMilkIndex] = useState(0)
  const [syrupIndex, setSyrupIndex] = useState(0)

  const [favorites, setFavorites] = useState<Favorite[]>(loadFavorites)
  const [storageError, setStorageError] = useState('')

  const collectedStars = 3
  const rewardGoal = 6

  const currentFavorite: Favorite = {
    sizeIndex,
    milkIndex,
    syrupIndex,
  }

  const isSaved = favorites.some(
    (favorite) =>
      getFavoriteId(favorite) === getFavoriteId(currentFavorite),
  )

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

  const subtitles: Record<Screen, string> = {
    menu: 'Собери свой идеальный капучино.',
    favorites: 'Твои любимые сочетания всегда под рукой.',
    loyalty: 'Собирай звёзды на пути к кофейному подарку.',
  }

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

  function saveFavorite() {
    if (isSaved) return

    updateFavorites([...favorites, currentFavorite])
  }

  function applyFavorite(favorite: Favorite) {
    setSizeIndex(favorite.sizeIndex)
    setMilkIndex(favorite.milkIndex)
    setSyrupIndex(favorite.syrupIndex)
    setScreen('menu')
  }

  function removeFavorite(favorite: Favorite) {
    updateFavorites(
      favorites.filter(
        (item) => getFavoriteId(item) !== getFavoriteId(favorite),
      ),
    )
  }

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
            {subtitles[screen]}
          </p>
        </header>

        <nav
          aria-label="Разделы приложения"
          className="mb-6 grid grid-cols-3 gap-1 rounded-2xl bg-[#E8E0D7] p-1"
        >
          {screens.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={screen === item.id ? 'page' : undefined}
              onClick={() => setScreen(item.id)}
              className={`min-h-12 cursor-pointer rounded-xl px-2 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#49362B] ${
                screen === item.id
                  ? 'bg-white shadow-sm'
                  : 'hover:bg-[#F7F2EA]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {storageError && (
          <p role="alert" className="mb-4 text-sm text-[#9B3028]">
            {storageError}
          </p>
        )}

        {screen === 'menu' && (
          <article className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex h-40 items-center justify-center rounded-2xl bg-[#CDE8DD]">
              <span
                className="text-7xl"
                role="img"
                aria-label="Чашка кофе"
              >
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
                <span className="text-3xl font-bold">
                  {totalPrice} ₽
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={saveFavorite}
              disabled={isSaved}
              className="mt-6 w-full cursor-pointer rounded-2xl bg-[#49362B] px-4 py-4 font-semibold text-white transition-colors hover:bg-[#624A3B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#49362B] disabled:cursor-default disabled:bg-[#CDE8DD] disabled:text-[#49362B]"
            >
              {isSaved
                ? '✓ Уже в избранном'
                : '♡ Сохранить в избранное'}
            </button>
          </article>
        )}

        {screen === 'favorites' && (
          <section aria-labelledby="favorites-heading">
            <h2 id="favorites-heading" className="text-2xl font-bold">
              Избранное · {favorites.length}
            </h2>

            {favorites.length === 0 ? (
              <div className="mt-4 rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm leading-relaxed text-[#756457]">
                  Здесь появятся твои любимые комбинации. Настрой
                  напиток и нажми «Сохранить в избранное».
                </p>

                <button
                  type="button"
                  onClick={() => setScreen('menu')}
                  className="mt-5 min-h-12 cursor-pointer rounded-xl bg-[#CDE8DD] px-4 py-3 text-sm font-semibold hover:bg-[#B9DCCD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#49362B]"
                >
                  Собрать напиток
                </button>
              </div>
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
                      <h3 className="font-bold">
                        Капучино · {size.label}
                      </h3>

                      <p className="mt-1 text-sm text-[#756457]">
                        Молоко: {milk.label} · {syrup.label}
                      </p>

                      <p className="mt-3 text-lg font-bold">
                        {price} ₽
                      </p>

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
        )}

        {screen === 'loyalty' && (
          <section
            aria-labelledby="loyalty-heading"
            className="rounded-3xl bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-[#756457]">
              Клуб любителей кофе
            </p>

            <h2
              id="loyalty-heading"
              className="mt-3 text-2xl font-bold"
            >
              Твой кофе — твои звёзды
            </h2>

            <p className="mt-3 leading-relaxed text-[#756457]">
              В нашей демопрограмме каждый напиток приносит звезду.
              Собери шесть — получи напиток в подарок.
            </p>

            <div className="mt-6 rounded-2xl bg-[#CDE8DD] p-5">
              <p className="font-semibold">
                {collectedStars} из {rewardGoal} звёзд
              </p>

              <div
                className="mt-4 flex justify-between gap-1 text-3xl"
                aria-hidden="true"
              >
                {Array.from({ length: rewardGoal }, (_, index) => (
                  <span
                    key={index}
                    className={
                      index < collectedStars
                        ? 'text-[#49362B]'
                        : 'text-[#688577]'
                    }
                  >
                    {index < collectedStars ? '★' : '☆'}
                  </span>
                ))}
              </div>

              <label
                htmlFor="loyalty-progress"
                className="mt-5 block text-sm"
              >
                Прогресс до подарочного напитка
              </label>

              <progress
                id="loyalty-progress"
                value={collectedStars}
                max={rewardGoal}
                className="mt-2 block h-3 w-full accent-[#49362B]"
              />

              <p className="mt-3 text-sm">
                До подарка осталось звёзд: {rewardGoal - collectedStars}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowQrNotice((previous) => !previous)}
              aria-expanded={showQrNotice}
              aria-controls="qr-notice"
              className="mt-6 min-h-12 w-full cursor-pointer rounded-2xl bg-[#49362B] px-4 py-4 font-semibold text-white hover:bg-[#624A3B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#49362B]"
            >
              {showQrNotice ? 'Скрыть пояснение' : 'Показать QR-код'}
            </button>

            <div id="qr-notice" hidden={!showQrNotice}>
              <p
                role="status"
                className="mt-4 rounded-2xl bg-[#F7F2EA] p-4 text-sm leading-relaxed"
              >
                Здесь появится QR-код карты лояльности. Сейчас это
                демонстрация: код не создаётся, бонусы не начисляются.
              </p>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-[#756457]">
              Демоусловия учебного проекта. Они не являются реальной
              программой лояльности StarHit Cafe.
            </p>
          </section>
        )}

        <p className="mt-5 text-center text-xs text-[#756457]">
          Учебный проект · Напиток и цены для демонстрации
        </p>
      </div>
    </main>
  )
}

export default App