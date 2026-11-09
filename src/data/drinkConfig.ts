import {
  alternativeMilks,
  alternativeMilkVolumeIds,
  drinkExtras,
  products,
  syrups,
} from './catalog'
import type { Product } from './catalog'

export type DrinkConfig = {
  productId: string
  variantId: string
  milkId: string
  syrupIds: string[]
  extraIds: string[]
}

export const FAVORITES_KEY = 'starhit-cafe-favorites-v2'
export const MAX_SYRUPS = 2

const syrupPrices: Record<string, number> = {
  '200': 14,
  '300': 19,
  '400': 19,
  '600': 19,
}

export function supportsMilk(product: Product) {
  return ['cappuccino', 'latte', 'flat-white'].includes(product.id)
}

export function isCream(id: string) {
  return id === 'whipped-cream' || id.startsWith('whipped-cream-')
}

export function getSyrupPrice(variantId: string) {
  return syrupPrices[variantId]
}

export function createConfig(product: Product): DrinkConfig {
  return {
    productId: product.id,
    variantId: product.variants[0].id,
    milkId: '',
    syrupIds: [],
    extraIds: [],
  }
}

export function configId(config: DrinkConfig) {
  return JSON.stringify([
    config.productId,
    config.variantId,
    config.milkId,
    [...config.syrupIds].sort(),
    [...config.extraIds].sort(),
  ])
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === 'string') &&
    new Set(value).size === value.length
  )
}

export function isDrinkConfig(value: unknown): value is DrinkConfig {
  if (typeof value !== 'object' || value === null) return false

  if (
    !('productId' in value) ||
    typeof value.productId !== 'string' ||
    !('variantId' in value) ||
    typeof value.variantId !== 'string' ||
    !('milkId' in value) ||
    typeof value.milkId !== 'string' ||
    !('syrupIds' in value) ||
    !isStringArray(value.syrupIds) ||
    !('extraIds' in value) ||
    !isStringArray(value.extraIds)
  ) {
    return false
  }

  const product = products.find((item) => item.id === value.productId)

  if (
    !product ||
    !product.variants.some((item) => item.id === value.variantId)
  ) {
    return false
  }

  if (
    value.milkId !== '' &&
    (!supportsMilk(product) ||
      !alternativeMilkVolumeIds.includes(value.variantId) ||
      !alternativeMilks.some((item) => item.id === value.milkId))
  ) {
    return false
  }

  if (product.categoryId !== 'classic') {
    return (
      value.milkId === '' &&
      value.syrupIds.length === 0 &&
      value.extraIds.length === 0
    )
  }

  return (
    value.syrupIds.length <= MAX_SYRUPS &&
    (value.syrupIds.length === 0 ||
      getSyrupPrice(value.variantId) !== undefined) &&
    value.syrupIds.every((id) => syrups.some((item) => item.id === id)) &&
    value.extraIds.every((id) => drinkExtras.some((item) => item.id === id)) &&
    value.extraIds.filter(isCream).length <= 1
  )
}

export function describeConfig(config: DrinkConfig) {
  const product = products.find((item) => item.id === config.productId)
  const variant = product?.variants.find(
    (item) => item.id === config.variantId,
  )

  if (!product || !variant) return null

  const milk = alternativeMilks.find((item) => item.id === config.milkId)
  const selectedSyrups = syrups.filter((item) =>
    config.syrupIds.includes(item.id),
  )
  const extras = drinkExtras.filter((item) =>
    config.extraIds.includes(item.id),
  )

  const syrupPrice = getSyrupPrice(config.variantId) ?? 0

  const additions = [
    ...(supportsMilk(product)
      ? [`Молоко: ${milk?.name ?? 'Обычное'}`]
      : []),
    ...selectedSyrups.map((item) => `Сироп: ${item.name}`),
    ...extras.map((item) => item.name),
  ]

  return {
    product,
    variant,
    milk,
    selectedSyrups,
    extras,
    syrupPrice,
    additions,
    total:
      variant.price +
      (milk?.price ?? 0) +
      selectedSyrups.length * syrupPrice +
      extras.reduce((sum, item) => sum + item.price, 0),
  }
}

export function loadFavorites(): {
  favorites: DrinkConfig[]
  error: string
} {
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(FAVORITES_KEY) ?? '[]',
    )

    if (!Array.isArray(raw)) {
      return {
        favorites: [],
        error: 'Не удалось прочитать избранное: неверный формат данных.',
      }
    }

    const valid = raw.filter(isDrinkConfig)
    const unique = new Map(valid.map((item) => [configId(item), item]))

    return {
      favorites: [...unique.values()],
      error:
        valid.length !== raw.length
          ? 'Некоторые сохранения недоступны: их данные повреждены или меню изменилось.'
          : '',
    }
  } catch {
    return {
      favorites: [],
      error: 'Не удалось прочитать избранное из браузера.',
    }
  }
}