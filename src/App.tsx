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

function App() {
  const [sizeIndex, setSizeIndex] = useState(1)
  const [milkIndex, setMilkIndex] = useState(0)
  const [syrupIndex, setSyrupIndex] = useState(0)

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
        </article>

        <p className="mt-5 text-center text-xs text-[#756457]">
          Учебный проект · Напиток и цены для демонстрации
        </p>
      </div>
    </main>
  )
}

export default App