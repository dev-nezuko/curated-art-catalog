import { artworks } from '../../data/artworks'
import {
  DEFAULT_LIMIT,
  filterArtworks,
  foldText,
  MAX_LIMIT,
  matchArtworks,
  normalizeLimit,
  normalizeQuery,
} from '../../lib/artworkFilters'

describe('normalizeQuery', () => {
  it('trims, lowercases and collapses whitespace', () => {
    expect(normalizeQuery(undefined)).toBe('')
    expect(normalizeQuery('  Van   Gogh ')).toBe('van gogh')
  })

  it('treats commas and semicolons as word separators', () => {
    expect(normalizeQuery('Velázquez, 1656; canvas')).toBe('velazquez 1656 canvas')
  })

  it('uses the first value of a repeated parameter', () => {
    expect(normalizeQuery(['Mona Lisa', 'Scream'])).toBe('mona lisa')
    expect(normalizeQuery([])).toBe('')
  })

  it('folds accents', () => {
    expect(normalizeQuery('Dalí')).toBe('dali')
    expect(foldText('Émile')).toBe('emile')
  })
})

describe('normalizeLimit', () => {
  it('falls back to the default for missing or non-positive values', () => {
    expect(normalizeLimit(undefined)).toBe(DEFAULT_LIMIT)
    expect(normalizeLimit('')).toBe(DEFAULT_LIMIT)
    expect(normalizeLimit('0')).toBe(DEFAULT_LIMIT)
    expect(normalizeLimit('-3')).toBe(DEFAULT_LIMIT)
  })

  it('treats fractions below one as missing rather than returning nothing', () => {
    expect(normalizeLimit('0.5')).toBe(DEFAULT_LIMIT)
  })

  it('rejects values Number() would coerce', () => {
    expect(normalizeLimit('abc')).toBe(DEFAULT_LIMIT)
    expect(normalizeLimit('12abc')).toBe(DEFAULT_LIMIT)
    expect(normalizeLimit('0x10')).toBe(DEFAULT_LIMIT)
    expect(normalizeLimit('1e3')).toBe(DEFAULT_LIMIT)
    expect(normalizeLimit('Infinity')).toBe(DEFAULT_LIMIT)
  })

  it('floors decimals and caps at the maximum', () => {
    expect(normalizeLimit('2.8')).toBe(2)
    expect(normalizeLimit(' 4 ')).toBe(4)
    expect(normalizeLimit('200')).toBe(MAX_LIMIT)
  })

  it('uses the first value of a repeated parameter', () => {
    expect(normalizeLimit(['3', '7'])).toBe(3)
  })
})

describe('matchArtworks', () => {
  it('matches title, artist, medium and year', () => {
    expect(matchArtworks(artworks, 'mona')).toHaveLength(1)
    expect(matchArtworks(artworks, 'van gogh')).toHaveLength(1)
    expect(matchArtworks(artworks, 'canvas').length).toBeGreaterThan(1)
    expect(matchArtworks(artworks, '1893').map((a) => a.title)).toEqual(['The Scream'])
  })

  it('finds accented names from plain queries and the reverse', () => {
    expect(matchArtworks(artworks, normalizeQuery('dali'))).toHaveLength(1)
    expect(matchArtworks(artworks, normalizeQuery('DALÍ'))).toHaveLength(1)
  })

  it('requires every word to match, in any order', () => {
    expect(matchArtworks(artworks, 'canvas gogh').map((a) => a.title)).toEqual(['Starry Night'])
    expect(matchArtworks(artworks, 'gogh poplar')).toHaveLength(0)
  })

  it('returns everything for an empty query', () => {
    expect(matchArtworks(artworks, '')).toHaveLength(artworks.length)
  })
})

describe('filterArtworks', () => {
  it('applies the limit after filtering', () => {
    expect(filterArtworks(artworks, '', 2)).toHaveLength(2)
    expect(filterArtworks(artworks, 'canvas', 1)).toHaveLength(1)
  })
})
