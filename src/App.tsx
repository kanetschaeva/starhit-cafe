import { useState } from 'react'
import MenuCatalog from './components/MenuCatalog'
import {
  configId,
  describeConfig,
  FAVORITES_KEY,
  isDrinkConfig,
  loadFavorites,
} from './data/drinkConfig'
import type { DrinkConfig } from './data/drinkConfig'

type Screen = 'menu' | 'favorites' | 'loyalty'

const screens: { id: Screen; label: string }[] = [
  { id: 'menu', label: 'Меню' },
  { id: 'favorites', label: 'Избранное' },
  { id: 'loyalty', label: 'Бонусы' },
]

const buttonClass =
  'min-h-12 cursor-pointer rounded-xl bg-[#E0F2EC] px-4 py-3 text-sm font-semibold hover:bg-[#CDE8DD] focus-visible:outline-2 focus-visible:outline-[#007F78]'

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu')
  const [favoriteState, setFavoriteState] = useState(loadFavorites)
  const [openingConfig, setOpeningConfig] = useState<DrinkConfig | null>(
    null,
  )
  const [menuSession, setMenuSession] = useState(0)
  const [notice, setNotice] = useState('')
  const [showQrNotice, setShowQrNotice] = useState(false)

  const { favorites, error } = favoriteState

  const subtitles: Record<Screen, string> = {
    menu: 'Выбирай любимое и пробуй новые сочетания.',
    favorites: 'Твои любимые сочетания всегда под рукой.',
    loyalty: 'Твоя карта лояльности.',
  }

  function updateFavorites(nextFavorites: DrinkConfig[]) {
    let storageError = ''

    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites))
    } catch {
      storageError =
        'Изменения доступны сейчас, но сохранить их в браузере не удалось. После обновления страницы они могут потеряться.'
    }

    setFavoriteState({
      favorites: nextFavorites,
      error: storageError,
    })
  }

  function saveFavorite(config: DrinkConfig) {
    if (!isDrinkConfig(config)) {
      setNotice('Не удалось сохранить комбинацию. Проверь выбранные опции.')
      return
    }

    if (favorites.some((item) => configId(item) === configId(config))) {
      return
    }

    updateFavorites([...favorites, config])
    setNotice('Комбинация добавлена в избранное.')
  }

  function openFavorite(config: DrinkConfig) {
    setOpeningConfig(config)
    setMenuSession((previous) => previous + 1)
    setNotice('')
    setScreen('menu')
  }

  function navigate(nextScreen: Screen) {
    setNotice('')

    if (nextScreen === 'menu' && screen !== 'menu') {
      setOpeningConfig(null)
      setMenuSession((previous) => previous + 1)
    }

    setScreen(nextScreen)
  }

  function removeFavorite(config: DrinkConfig) {
    updateFavorites(
      favorites.filter((item) => configId(item) !== configId(config)),
    )
    setNotice('Комбинация удалена из избранного.')
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
          <p className="mt-3 text-[#756457]">{subtitles[screen]}</p>
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
              onClick={() => navigate(item.id)}
              className={`min-h-12 cursor-pointer rounded-xl px-2 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[#007F78] ${
                screen === item.id
                  ? 'bg-white shadow-sm'
                  : 'hover:bg-[#F7F2EA]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {error && (
          <p role="alert" className="mb-4 text-sm text-[#9B3028]">
            {error}
          </p>
        )}

        <p role="status" className="mb-4 text-sm text-[#007F78]">
          {notice}
        </p>

        {screen === 'menu' && (
          <MenuCatalog
            key={menuSession}
            initialConfig={openingConfig}
            favorites={favorites}
            onSave={saveFavorite}
          />
        )}

        {screen === 'favorites' && (
          <section aria-labelledby="favorites-heading">
            <h2 id="favorites-heading" className="text-2xl font-bold">
              Избранное · {favorites.length}
            </h2>

            {favorites.length === 0 ? (
              <div className="mt-4 rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm leading-relaxed text-[#756457]">
                  Сохрани напиток со своими сиропами и добавками
                  или добавь любимый десерт.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('menu')}
                  className={`mt-5 ${buttonClass}`}
                >
                  Открыть меню
                </button>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm text-[#756457]">
                  Цены рассчитываются по текущему каталогу.
                </p>

                <ul className="mt-4 space-y-3">
                  {favorites.map((favorite) => {
                    const details = describeConfig(favorite)
                    if (!details) return null

                    return (
                      <li
                        key={configId(favorite)}
                        className="rounded-2xl bg-white p-5 shadow-sm"
                      >
                        <h3 className="font-bold">
                          {details.product.name} · {details.variant.label}
                        </h3>

                        {details.additions.length > 0 && (
                          <p className="mt-2 text-sm leading-relaxed text-[#756457]">
                            {details.additions.join(' · ')}
                          </p>
                        )}

                        <p className="mt-3 text-lg font-bold">
                          {details.total} ₽
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openFavorite(favorite)}
                            className={buttonClass}
                          >
                            Открыть
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFavorite(favorite)}
                            aria-label={`Удалить: ${details.product.name}, ${details.variant.label}, ${details.additions.join(', ')}`}
                            className="min-h-12 cursor-pointer rounded-xl px-4 py-3 text-sm text-[#756457] hover:bg-[#F7F2EA] focus-visible:outline-2 focus-visible:outline-[#007F78]"
                          >
                            Удалить
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </section>
        )}

        {screen === 'loyalty' && (
          <section
            aria-labelledby="loyalty-heading"
            className="rounded-3xl bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold text-[#756457]">
              Карта гостя
            </p>

            <h2 id="loyalty-heading" className="mt-3 text-2xl font-bold">
              Твой кофе — твои звёзды
            </h2>

            <p className="mt-3 leading-relaxed text-[#756457]">
              Раздел готовится к обновлению по программе лояльности
              StarHit Cafe. Баланс и история появятся после подключения
              аккаунта и серверной части.
            </p>

            <button
              type="button"
              onClick={() => setShowQrNotice((previous) => !previous)}
              aria-expanded={showQrNotice}
              aria-controls="qr-notice"
              className={`mt-6 w-full ${buttonClass}`}
            >
              {showQrNotice ? 'Скрыть пояснение' : 'Показать QR-код'}
            </button>

            <div id="qr-notice" hidden={!showQrNotice}>
              <p role="status" className="mt-4 text-sm text-[#756457]">
                В прототипе карта ещё не подключена к кассе.
                QR-код пока не создаётся.
              </p>
            </div>
          </section>
        )}

        <p className="mt-6 text-center text-xs text-[#756457]">
          Прототип StarHit Cafe · Без оформления заказов
        </p>
      </div>
    </main>
  )
}