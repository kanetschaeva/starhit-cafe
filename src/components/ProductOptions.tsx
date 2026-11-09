import { useState } from 'react'
import {
  alternativeMilks,
  alternativeMilkVolumeIds,
  drinkExtras,
  syrups,
} from '../data/catalog'
import type { Product } from '../data/catalog'
import {
  configId,
  createConfig,
  describeConfig,
  getSyrupPrice,
  isCream,
  MAX_SYRUPS,
  supportsMilk,
} from '../data/drinkConfig'
import type { DrinkConfig } from '../data/drinkConfig'

type Props = {
  product: Product
  initialConfig?: DrinkConfig
  favorites: DrinkConfig[]
  onSave: (config: DrinkConfig) => void
}

const selectClass =
  'mt-2 min-h-12 w-full rounded-xl border border-[#DCE7E2] bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-[#007F78]'

const optionClass =
  'flex min-h-12 items-center gap-3 rounded-xl border border-[#DCE7E2] px-3 py-3 text-sm'

export default function ProductOptions({
  product,
  initialConfig,
  favorites,
  onSave,
}: Props) {
  const [config, setConfig] = useState<DrinkConfig>(
    () => initialConfig ?? createConfig(product),
  )

  const details = describeConfig(config)

  if (!details) return <p>Эта позиция больше недоступна.</p>

  const isClassic = product.categoryId === 'classic'
  const hasMilk = supportsMilk(product)
  const milkAvailable =
    hasMilk && alternativeMilkVolumeIds.includes(config.variantId)
  const syrupPrice = getSyrupPrice(config.variantId)
  const creamOptions = drinkExtras.filter((item) => isCream(item.id))
  const otherExtras = drinkExtras.filter((item) => !isCream(item.id))
  const selectedCreamId =
    config.extraIds.find((id) => isCream(id)) ?? ''

  const isSaved = favorites.some(
    (item) => configId(item) === configId(config),
  )

  function changeVariant(variantId: string) {
    setConfig((previous) => ({
      ...previous,
      variantId,
      milkId: alternativeMilkVolumeIds.includes(variantId)
        ? previous.milkId
        : '',
      syrupIds:
        getSyrupPrice(variantId) !== undefined ? previous.syrupIds : [],
    }))
  }

  function toggleSyrup(id: string) {
    setConfig((previous) => {
      if (previous.syrupIds.includes(id)) {
        return {
          ...previous,
          syrupIds: previous.syrupIds.filter((item) => item !== id),
        }
      }

      if (previous.syrupIds.length >= MAX_SYRUPS) return previous

      return {
        ...previous,
        syrupIds: [...previous.syrupIds, id],
      }
    })
  }

  function toggleExtra(id: string) {
    setConfig((previous) => ({
      ...previous,
      extraIds: previous.extraIds.includes(id)
        ? previous.extraIds.filter((item) => item !== id)
        : [...previous.extraIds, id],
    }))
  }

  function changeCream(id: string) {
    setConfig((previous) => ({
      ...previous,
      extraIds: [
        ...previous.extraIds.filter((item) => !isCream(item)),
        ...(id ? [id] : []),
      ],
    }))
  }

  return (
    <div className="mt-3">
      <div
        aria-live="polite"
        aria-atomic="true"
        className="mb-6"
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <strong className="text-3xl text-[#007F78]">
            {details.variant.price} ₽
          </strong>
          <span className="text-sm text-[#62736E]">
            {details.variant.label}
          </span>
        </div>

        {isClassic && (
          <p className="mt-1 text-xs text-[#62736E]">
            Базовая цена · добавки рассчитываются отдельно
          </p>
        )}
      </div>

      <fieldset>
        <legend className="mb-3 font-semibold">
          {product.variants.length > 1 ? 'Выбери объём' : 'Порция'}
        </legend>

        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              aria-pressed={variant.id === config.variantId}
              onClick={() => changeVariant(variant.id)}
              className={`min-h-12 cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[#007F78] ${
                variant.id === config.variantId
                  ? 'border-[#007F78] bg-[#007F78] text-white'
                  : 'border-[#DCE7E2] bg-white hover:bg-[#E0F2EC]'
              }`}
            >
              {variant.label}
            </button>
          ))}
        </div>
      </fieldset>

      {hasMilk && (
        <div className="mt-6">
          <label htmlFor="product-milk" className="font-semibold">
            Молоко
          </label>

          <select
            id="product-milk"
            value={config.milkId}
            disabled={!milkAvailable}
            onChange={(event) => {
              const milkId = event.target.value
              setConfig((previous) => ({ ...previous, milkId }))
            }}
            className={`${selectClass} disabled:bg-[#F4F8F5]`}
          >
            <option value="">Обычное · без доплаты</option>
            {alternativeMilks.map((milk) => (
              <option key={milk.id} value={milk.id}>
                {milk.name} · +{milk.price} ₽
              </option>
            ))}
          </select>

          {!milkAvailable && (
            <p className="mt-2 text-xs text-[#62736E]">
              В прототипе замена молока доступна для 200 и 300 мл.
            </p>
          )}
        </div>
      )}

      {isClassic && syrupPrice !== undefined && (
        <fieldset className="mt-6">
          <legend className="font-semibold">
            Сиропы · {config.syrupIds.length}/{MAX_SYRUPS}
          </legend>

          <p id="syrup-limit" className="mt-2 text-sm text-[#62736E]">
            До двух разных вкусов. Каждый вкус — отдельная порция
            за {syrupPrice} ₽.
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {syrups.map((syrup) => {
              const checked = config.syrupIds.includes(syrup.id)
              const disabled =
                !checked && config.syrupIds.length >= MAX_SYRUPS

              return (
                <label
                  key={syrup.id}
                  className={`${optionClass} ${
                    checked
                      ? 'border-[#007F78] bg-[#E0F2EC]'
                      : 'bg-white'
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
                  <span className="shrink-0">+{syrupPrice} ₽</span>
                </label>
              )
            })}
          </div>

          <p role="status" className="mt-2 text-sm text-[#62736E]">
            {config.syrupIds.length === MAX_SYRUPS
              ? 'Для другого вкуса сначала сними одну отметку.'
              : `Можно добавить сиропов: ${
                  MAX_SYRUPS - config.syrupIds.length
                }.`}
          </p>
        </fieldset>
      )}

      {isClassic && (
        <>
          <fieldset className="mt-6">
            <legend className="font-semibold">Добавки</legend>

            <div className="mt-3 space-y-2">
              {otherExtras.map((extra) => (
                <label
                  key={extra.id}
                  className={`${optionClass} cursor-pointer ${
                    config.extraIds.includes(extra.id)
                      ? 'border-[#007F78] bg-[#E0F2EC]'
                      : 'bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={config.extraIds.includes(extra.id)}
                    onChange={() => toggleExtra(extra.id)}
                    className="h-5 w-5 shrink-0 accent-[#007F78]"
                  />
                  <span className="flex-1">{extra.name}</span>
                  <span className="shrink-0">+{extra.price} ₽</span>
                </label>
              ))}
            </div>
          </fieldset>

          {creamOptions.length > 0 && (
            <div className="mt-6">
              <label htmlFor="product-cream" className="font-semibold">
                Взбитые сливки
              </label>

              <select
                id="product-cream"
                value={selectedCreamId}
                onChange={(event) => changeCream(event.target.value)}
                className={selectClass}
              >
                <option value="">Без сливок</option>
                {creamOptions.map((cream) => (
                  <option key={cream.id} value={cream.id}>
                    {cream.name} · +{cream.price} ₽
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      <div className="mt-6 rounded-2xl bg-[#E0F2EC] p-4">
        <h3 className="font-semibold">Твоя комбинация</h3>

        <p className="mt-2 text-sm leading-relaxed text-[#36534A]">
          {[product.name, details.variant.label, ...details.additions].join(
            ' · ',
          )}
        </p>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt>{isClassic ? 'Основа' : 'Позиция меню'}</dt>
            <dd className="shrink-0">{details.variant.price} ₽</dd>
          </div>

          {details.milk && (
            <div className="flex justify-between gap-3">
              <dt>Молоко: {details.milk.name}</dt>
              <dd className="shrink-0">+{details.milk.price} ₽</dd>
            </div>
          )}

          {details.selectedSyrups.map((syrup) => (
            <div key={syrup.id} className="flex justify-between gap-3">
              <dt>Сироп: {syrup.name}</dt>
              <dd className="shrink-0">+{details.syrupPrice} ₽</dd>
            </div>
          ))}

          {details.extras.map((extra) => (
            <div key={extra.id} className="flex justify-between gap-3">
              <dt>{extra.name}</dt>
              <dd className="shrink-0">+{extra.price} ₽</dd>
            </div>
          ))}
        </dl>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="mt-4 flex items-center justify-between border-t border-[#BEDDD0] pt-4"
        >
          <span className="font-semibold">Итого</span>
          <strong className="text-3xl">{details.total} ₽</strong>
        </div>
      </div>

      <button
        type="button"
        disabled={isSaved}
        onClick={() => onSave(config)}
        className="mt-5 min-h-12 w-full cursor-pointer rounded-2xl bg-[#007F78] px-4 py-4 font-semibold text-white hover:bg-[#00665F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007F78] disabled:cursor-default disabled:bg-[#E0F2EC] disabled:text-[#36534A]"
      >
        {isSaved ? '✓ Уже в избранном' : '♡ Сохранить в избранное'}
      </button>
    </div>
  )
}