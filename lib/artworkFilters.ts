import { Artwork } from '../data/artworks'

export const MAX_LIMIT = 50
export const DEFAULT_LIMIT = 10

type QueryValue = string | string[] | undefined

const firstValue = (value: QueryValue): string | undefined =>
  Array.isArray(value) ? value[0] : value

// Strip accents so "dali" finds "Dalí" and "Dali" alike.
export const foldText = (value: string): string =>
  value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

// Commas and semicolons separate words, so "velazquez, 1656" reads as two terms.
export const normalizeQuery = (value: QueryValue): string =>
  foldText(firstValue(value) ?? '')
    .replace(/[,;]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')

// Only plain decimal numbers count: "0x10", "1e3" or "12abc" fall back to the default
// instead of being coerced by Number().
export const normalizeLimit = (value: QueryValue): number => {
  const raw = firstValue(value)?.trim()

  if (!raw || !/^\d+(\.\d+)?$/.test(raw)) {
    return DEFAULT_LIMIT
  }

  const whole = Math.floor(Number(raw))

  if (whole < 1) {
    return DEFAULT_LIMIT
  }

  return Math.min(whole, MAX_LIMIT)
}

const searchableText = (artwork: Artwork): string =>
  foldText(`${artwork.title} ${artwork.artist} ${artwork.medium} ${artwork.year}`)

// Every word of the query must appear somewhere, so "gogh canvas" narrows rather than misses.
export const matchArtworks = (items: Artwork[], searchTerm: string): Artwork[] => {
  const words = searchTerm.split(' ').filter(Boolean)

  if (words.length === 0) {
    return items
  }

  return items.filter((artwork) => {
    const haystack = searchableText(artwork)
    return words.every((word) => haystack.includes(word))
  })
}

export const filterArtworks = (items: Artwork[], searchTerm: string, limit: number): Artwork[] =>
  matchArtworks(items, searchTerm).slice(0, limit)
