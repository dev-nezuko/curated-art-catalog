import { Artwork } from '../data/artworks'

export const MAX_LIMIT = 50
const DEFAULT_LIMIT = 10

export const normalizeQuery = (value: string | string[] | undefined): string => {
  if (!value) {
    return ''
  }

  return (Array.isArray(value) ? value[0] : value).trim().toLowerCase()
}

export const normalizeLimit = (value: string | string[] | undefined): number => {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw)

  if (!raw || Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT
  }

  return Math.min(parsed, MAX_LIMIT)
}

export const filterArtworks = (
  items: Artwork[],
  searchTerm: string,
  limit: number
): Artwork[] => {
  const filteredItems = searchTerm
    ? items.filter((artwork) => {
        const haystack = `${artwork.title} ${artwork.artist} ${artwork.medium}`.toLowerCase()
        return haystack.includes(searchTerm)
      })
    : items

  return filteredItems.slice(0, limit)
}
