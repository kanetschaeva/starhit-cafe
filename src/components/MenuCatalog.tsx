import { useState } from 'react'
import { categories, products } from '../data/catalog'
import type { CategoryId, Product } from '../data/catalog'

const categorySymbols: Record<CategoryId, string> = {
  classic: '☕',
  frappe: '🥤',
  breakfast: '🥞',
  sandwiches: '🥪',
  desserts: '🍰',
}

function normalize(value: string) {
  return value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim()
}

function ProductDetails({
  product,
  onBack,
}: {
  product: Product
  onBack: () => void
}) {
  const [variantId, setVariantId] = useState(product.variants[0].id)

  const selectedVariant =
    product.variants.find((variant) => variant.id === variantId) ??
    product.variants[0]

  const category = categories.find(
    (item) => item.id === product.categoryId,
  )

  return (
    <section aria-labelledby="product-title">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 min-h-11 cursor-pointer rounded-xl px-3 text-sm font-semibold text-[#007F78] hover:bg-[#E0F2EC] focus-visible:outline-2"
      >
        ← Назад к меню
      </button>

      <article className="rounded-3xl bg-white p-5 shadow-sm">
        <div
          aria-hidden="true"
          className="flex h-48 items-center justify-center rounded-2xl bg-[#E0F2EC] text-7xl"
        >
          {categorySymbols[product.categoryId]}
        </div>

        <p className="mt-5 text-sm text-[#62736E]">
          {category?.name}
        </p>

        <h2
          id="product-title"
          tabIndex={-1}
          ref={(element) => {
            element?.focus()
          }}
          className="mt-1 text-2xl font-bold outline-none"
        >
          {product.name}
        </h2>

        <fieldset className="mt-6">
          <legend className="mb-3 font-semibold">
            {product.variants.length > 1 ? 'Выбери объём' : 'Порция'}
          </legend>

          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                aria-pressed={variant.id === selectedVariant.id}
                onClick={() => setVariantId(variant.id)}
                className={`min-h-12 cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${
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

        <div
          aria-live="polite"
          aria-atomic="true"
          className="mt-6 flex items-center justify-between border-t border-[#E5ECE8] pt-5"
        >
          <span className="text-sm text-[#62736E]">Цена основы</span>
          <strong className="text-3xl">{selectedVariant.price} ₽</strong>
        </div>

        <details className="mt-6 rounded-2xl bg-[#F4F8F5] p-4">
          <summary className="cursor-pointer font-semibold">
            Состав и аллергены
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-[#62736E]">
            Информация пока уточняется. Если у тебя есть аллергия,
            проверь состав у бариста перед покупкой.
          </p>
        </details>
      </article>
    </section>
  )
}

export default function MenuCatalog() {
  const [categoryId, setCategoryId] = useState<CategoryId | 'all'>('all')
  const [query, setQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null,
  )
  const [returnFocusId, setReturnFocusId] = useState<string | null>(null)

  const normalizedQuery = normalize(query)

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      categoryId === 'all' || product.categoryId === categoryId

    return matchesCategory && normalize(product.name).includes(normalizedQuery)
  })

  if (selectedProduct) {
    return (
      <ProductDetails
        key={selectedProduct.id}
        product={selectedProduct}
        onBack={() => {
          setReturnFocusId(selectedProduct.id)
          setSelectedProduct(null)
        }}
      />
    )
  }

  return (
    <section aria-labelledby="catalog-heading">
      <h2 id="catalog-heading" className="text-3xl font-bold">
        Найди свой вкус
      </h2>

      <label
        htmlFor="catalog-search"
        className="mt-5 block text-sm font-semibold"
      >
        Поиск по меню
      </label>

      <input
        id="catalog-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Например, капучино или чизкейк"
        className="mt-2 min-h-12 w-full rounded-2xl border border-[#DCE7E2] bg-white px-4 outline-none focus:border-[#007F78] focus:ring-2 focus:ring-[#007F78]"
      />

      <div
        role="group"
        aria-label="Категории меню"
        className="mt-4 flex gap-2 overflow-x-auto pb-3"
      >
        {[{ id: 'all' as const, name: 'Всё' }, ...categories].map(
          (category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={categoryId === category.id}
              onClick={() => {
                setReturnFocusId(null)
                setCategoryId(category.id)
              }}
              className={`min-h-11 shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${
                categoryId === category.id
                  ? 'bg-[#007F78] text-white'
                  : 'bg-white hover:bg-[#E0F2EC]'
              }`}
            >
              {category.name}
            </button>
          ),
        )}
      </div>

      <p role="status" className="my-4 text-sm text-[#62736E]">
        Найдено позиций: {filteredProducts.length}
      </p>

      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl bg-white p-6">
          <h3 className="font-bold">Ничего не нашли</h3>
          <p className="mt-2 text-sm text-[#62736E]">
            Попробуй другое название или выбери категорию «Всё».
          </p>

          <button
            type="button"
            onClick={() => {
              setQuery('')
              setCategoryId('all')
              setReturnFocusId(null)
            }}
            className="mt-4 min-h-11 cursor-pointer rounded-xl bg-[#E0F2EC] px-4 font-semibold focus-visible:outline-2"
          >
            Сбросить поиск
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => {
            const minimumPrice = Math.min(
              ...product.variants.map((variant) => variant.price),
            )

            return (
              <li key={product.id} className="min-w-0">
                <button
                  type="button"
                  ref={(element) => {
                    if (product.id === returnFocusId) {
                      element?.focus()
                    }
                  }}
                  onClick={() => {
                    setReturnFocusId(null)
                    setSelectedProduct(product)
                  }}
                  className="flex h-full w-full cursor-pointer flex-col rounded-3xl bg-white p-3 text-left shadow-sm transition-colors hover:bg-[#F0FAF5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007F78]"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-28 w-full items-center justify-center rounded-2xl bg-[#E0F2EC] text-5xl"
                  >
                    {categorySymbols[product.categoryId]}
                  </span>

                  <span className="mt-3 text-sm font-bold leading-snug">
                    {product.name}
                  </span>

                  <span className="mt-auto pt-2 text-sm text-[#007F78]">
                    {product.variants.length > 1 ? 'от ' : ''}
                    {minimumPrice} ₽
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <p className="mt-5 text-xs leading-relaxed text-[#62736E]">
        Демонстрационный каталог. Ассортимент и цены могут отличаться
        в конкретной кофейне.
      </p>
    </section>
  )
}