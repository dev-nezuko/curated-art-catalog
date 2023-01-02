import { artworks } from '../../data/artworks'
import {
  filterArtworks,
  MAX_LIMIT,
  normalizeLimit,
  normalizeQuery,
} from '../../lib/artworkFilters'

describe('artworkFilters', () => {
  it('normalizes query input safely', () => {
    expect(normalizeQuery(undefined)).toBe('')
    expect(normalizeQuery('  Van Gogh ')).toBe('van gogh')
    expect(normalizeQuery(['Mona Lisa'])).toBe('mona lisa')
  })

  it('normalizes limit with defaults and max bounds', () => {
    expect(normalizeLimit(undefined)).toBe(10)
    expect(normalizeLimit('0')).toBe(10)
    expect(normalizeLimit('200')).toBe(MAX_LIMIT)
    expect(normalizeLimit(['3'])).toBe(3)
    expect(normalizeLimit('2.8')).toBe(2)
  })

  it('filters artworks by title, artist, and medium', () => {
    expect(filterArtworks(artworks, 'mona', 10)).toHaveLength(1)
    expect(filterArtworks(artworks, 'van gogh', 10)).toHaveLength(1)
    expect(filterArtworks(artworks, 'canvas', 10).length).toBeGreaterThan(1)
  })

  it('applies item limit after filtering', () => {
    const filtered = filterArtworks(artworks, '', 2)
    expect(filtered).toHaveLength(2)
  })
})
