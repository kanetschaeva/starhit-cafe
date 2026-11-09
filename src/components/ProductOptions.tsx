import { useState } from 'react'
import {
  alternativeMilks,
  alternativeMilkVolumeIds,
  drinkExtras,
  syrups,
} from '../data/catalog'
import type { Product } from '../data/catalog'

const MAX_SYRUPS = 2

const syrupPricesByVolume: Record<string, number> = {
  '200': 14,
  '300': 19,
  '400': 19,
  '600': 19,
}

const controlClass =
  'mt-2 min-h-12 w-full rounded-xl border border-[#DCE7E2] bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-[#007F78]'

function isWhippedCream(id: string) {
  return id === 'whipped-cream' || id.startsWith('whipped-cream-')
}

export default function ProductOptions({
  product,
}: {
  product: Product
}) {
  const [variantId, setVariantId] = useState(product.variants[0].id)
  const [milkId, setMilkId] = useState('')
  const [syrupIds, setSyrupIds] = useState<string[]>([])
  const [extraIds, setExtraIds] = useState<string[]>([])
  const [creamId, setCreamId] = useState('')

  const selectedVariant =
    product.variants.find((variant) => variant.id === variantId) ??
    product.variants[0]

  const isClassic = product.categoryId === 'classic'

  const supportsMilk = [
    'cappuccino',
    'latte',
    'flat-white',
  ].includes(product.id)

  const milkAvailable =
    supportsMilk &&
    alternativeMilkVolumeIds.includes(selectedVariant.id)

  const selectedMilk = milkAvailable
    ? alternativeMilks.find((milk) => milk.id === milkId)
    : undefined

  const syrupUnitPrice = syrupPricesByVolume[selectedVariant.id]
  const syrupsAvailable = isClassic && syrupUnitPrice !== undefined

  const selectedSyrups = syrupsAvailable
    ? syrups.filter((syrup) => syrupIds.includes(syrup.id))
    : []

  const creamOptions = drinkExtras.filter((extra) =>
    isWhippedCream(extra.id),
  )

  const otherExtras = drinkExtras.filter(
    (extra) => !isWhippedCream(extra.id),
  )

  const selectedCream = isClassic
    ? creamOptions.find((extra) => extra.id === creamId)
    : undefined

  const selectedOtherExtras = isClassic
    ? otherExtras.filter((extra) => extraIds.includes(extra.id))
    : []

  const selectedExtras = [
    ...selectedOtherExtras,
    ...(selectedCream ? [selectedCream] : []),
  ]

  const milkPrice = selectedMilk?.price ?? 0

  const syrupsPrice =
    selectedSyrups.length * (syrupUnitPrice ?? 0)

  const extrasPrice = selectedExtras.reduce(
    (total, extra) => total + extra.price,
    0,
  )

  const totalPrice =
    selectedVariant.price + milkPrice + syrupsPrice + extrasPrice

  const summary = [
    product.name,
    selectedVariant.label,
    ...(supportsMilk
      ? [`Молоко: ${selectedMilk?.name ?? 'Обычное'}`]
      : []),
    ...selectedSyrups.map((syrup) => `Сироп: ${syrup.name}`),
    ...selectedExtras.map((extra) => extra.name),
  ].join(' · ')

  function changeVariant(nextId: string) {
    setVariantId(nextId)

    if (!alternativeMilkVolumeIds.includes(nextId)) {
      setMilkId('')
    }

    if (syrupPricesByVolume[nextId] === undefined) {
      setSyrupIds([])
    }
  }

  function toggleSyrup(id: string) {
    setSyrupIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id)
      }

      if (previous.length >= MAX_SYRUPS) return previous

      return [...previous, id]
    })
  }

  function toggleExtra(id: string) {
    setExtraIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    )
  }

  return (
    <div className="mt-6">
      <fieldset>
        <legend className="mb-3 font-semibold">
          {product.variants.length > 1 ? 'Выбери объём' : 'Порция'}
        </legend>

        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              aria-pressed={variant.id === selectedVariant.id}
              onClick={() => changeVariant(variant.id)}
              className={`min-h-12 cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007F78] ${
                variant.id === selectedVariant.id
                  ? 'border-[#007F78] bg-[#007F78] text-white'
                  : 'border-[#DCE7E2] hover:bg-[#E0F2EC]'
              }`}
            >
              {variant.label}
            </button>
          ))}
        </div>
      </fieldset>

      {supportsMilk && (
        <div className="mt-6">
          <label htmlFor="product-milk" className="font-semibold">
            Молоко
          </label>

          <select
            id="product-milk"
            value={milkId}
            disabled={!milkAvailable}
            onChange={(event) => setMilkId(event.target.value)}
            aria-describedby={
              !milkAvailable ? 'milk-availability' : undefined
            }
            className={`${controlClass} disabled:bg-[#F4F8F5] disabled:text-[#62736E]`}
          >
            <option value="">Обычное · без доплаты</option>

            {alternativeMilks.map((milk) => (
              <option key={milk.id} value={milk.id}>
                {milk.name} · +{milk.price} ₽
              </option>
            ))}
          </select>

          {!milkAvailable && (
            <p
              id="milk-availability"
              className="mt-2 text-xs leading-relaxed text-[#62736E]"
            >
              В прототипе замена молока доступна для 200 и 300 мл.
              Условия для больших объёмов пока уточняются.
            </p>
          )}
        </div>
      )}

      {isClassic && (
        <>
          {syrupsAvailable && (
            <fieldset className="mt-6">
              <legend className="font-semibold">
                Сиропы · {syrupIds.length}/{MAX_SYRUPS}
              </legend>

              <p
                id="syrup-limit"
                className="mt-2 text-sm leading-relaxed text-[#62736E]"
              >
                Выбери до двух разных вкусов. Каждый вкус — отдельная
                порция за {syrupUnitPrice} ₽ для объёма{' '}
                {selectedVariant.label}.
              </p>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {syrups.map((syrup) => {
                  const checked = syrupIds.includes(syrup.id)
                  const disabled =
                    !checked && syrupIds.length >= MAX_SYRUPS

                  return (
                    <label
                      key={syrup.id}
                      className={`flex min-h-12 items-center gap-3 rounded-xl border px-3 py-3 text-sm ${
                        checked
                          ? 'border-[#007F78] bg-[#E0F2EC]'
                          : 'border-[#DCE7E2] bg-white'
                      } ${
                        disabled
                          ? 'cursor-not-allowed opacity-50'
                          : 'cursor-pointer'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        aria-describedby="syrup-limit"
                        onChange={() => toggleSyrup(syrup.id)}
                        className="h-5 w-5 shrink-0 accent-[#007F78]"
                      />

                      <span className="flex-1">{syrup.name}</span>

                      <span className="shrink-0 text-[#007F78]">
                        +{syrupUnitPrice} ₽
                      </span>
                    </label>
                  )
                })}
              </div>

              <p
                role="status"
                className="mt-2 text-sm leading-relaxed text-[#62736E]"
              >
                {syrupIds.length === MAX_SYRUPS
                  ? 'Выбрано два вкуса. Чтобы выбрать другой, сними одну отметку.'
                  : `Можно добавить сиропов: ${MAX_SYRUPS - syrupIds.length}.`}
              </p>
            </fieldset>
          )}

          <fieldset className="mt-6">
            <legend className="font-semibold">Добавки</legend>

            <div className="mt-3 space-y-2">
              {otherExtras.map((extra) => {
                const checked = extraIds.includes(extra.id)

                return (
                  <label
                    key={extra.id}
                    className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm ${
                      checked
                        ? 'border-[#007F78] bg-[#E0F2EC]'
                        : 'border-[#DCE7E2] bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleExtra(extra.id)}
                      className="h-5 w-5 shrink-0 accent-[#007F78]"
                    />

                    <span className="flex-1">{extra.name}</span>

                    <span className="shrink-0 text-[#007F78]">
                      +{extra.price} ₽
                    </span>
                  </label>
                )
              })}
            </div>

            <p className="mt-2 text-xs leading-relaxed text-[#62736E]">
              Каждую добавку можно выбрать один раз.
            </p>
          </fieldset>

          {creamOptions.length > 0 && (
            <fieldset className="mt-6">
              <legend className="font-semibold">
                Взбитые сливки
              </legend>

              <p className="mt-2 text-sm text-[#62736E]">
                Выбери один вариант.
              </p>

              <div className="mt-3 space-y-2">
                <label
                  className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm ${
                    creamId === ''
                      ? 'border-[#007F78] bg-[#E0F2EC]'
                      : 'border-[#DCE7E2] bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="product-cream"
                    value=""
                    checked={creamId === ''}
                    onChange={() => setCreamId('')}
                    className="h-5 w-5 shrink-0 accent-[#007F78]"
                  />

                  <span className="flex-1">Без сливок</span>
                  <span className="text-[#62736E]">0 ₽</span>
                </label>

                {creamOptions.map((cream) => {
                  const checked = creamId === cream.id

                  return (
                    <label
                      key={cream.id}
                      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm ${
                        checked
                          ? 'border-[#007F78] bg-[#E0F2EC]'
                          : 'border-[#DCE7E2] bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="product-cream"
                        value={cream.id}
                        checked={checked}
                        onChange={() => setCreamId(cream.id)}
                        className="h-5 w-5 shrink-0 accent-[#007F78]"
                      />

                      <span className="flex-1">{cream.name}</span>

                      <span className="shrink-0 text-[#007F78]">
                        +{cream.price} ₽
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          )}
        </>
      )}

      <div className="mt-6 rounded-2xl bg-[#E0F2EC] p-4">
        <h3 className="font-semibold">Твоя комбинация</h3>

        <p className="mt-2 text-sm leading-relaxed text-[#36534A]">
          {summary}
        </p>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt>{isClassic ? 'Основа' : 'Позиция меню'}</dt>
            <dd className="shrink-0">{selectedVariant.price} ₽</dd>
          </div>

          {selectedMilk && (
            <div className="flex justify-between gap-3">
              <dt>Молоко: {selectedMilk.name}</dt>
              <dd className="shrink-0">+{milkPrice} ₽</dd>
            </div>
          )}

          {selectedSyrups.map((syrup) => (
            <div
              key={syrup.id}
              className="flex justify-between gap-3"
            >
              <dt>Сироп: {syrup.name}</dt>
              <dd className="shrink-0">+{syrupUnitPrice} ₽</dd>
            </div>
          ))}

          {selectedExtras.map((extra) => (
            <div
              key={extra.id}
              className="flex justify-between gap-3"
            >
              <dt>{extra.name}</dt>
              <dd className="shrink-0">+{extra.price} ₽</dd>
            </div>
          ))}
        </dl>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="mt-4 flex items-center justify-between gap-3 border-t border-[#BEDDD0] pt-4"
        >
          <span className="font-semibold">Итого</span>
          <strong className="text-3xl">{totalPrice} ₽</strong>
        </div>
      </div>
    </div>
  )
}