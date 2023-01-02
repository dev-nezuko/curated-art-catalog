import { useCallback, useEffect, useState } from 'react'
import type { Artwork } from '../data/artworks'
import { MAX_LIMIT } from './artworkFilters'

export type SearchState =
  | { status: 'loading'; artworks: Artwork[] }
  | { status: 'ready'; artworks: Artwork[]; total: number }
  | { status: 'error'; artworks: Artwork[] }

export const SEARCH_DEBOUNCE_MS = 200

const buildUrl = (search: string): string => {
  const params = new URLSearchParams({ limit: String(MAX_LIMIT) })
  const term = search.trim()
  if (term) {
    params.set('search', term)
  }
  return `/api/artworks?${params}`
}

// Debounces typing, cancels the previous request and keeps the last results on screen
// while the next ones load, so the grid does not flash empty between keystrokes.
export const useArtworkSearch = (search: string) => {
  const [state, setState] = useState<SearchState>({ status: 'loading', artworks: [] })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const timer = setTimeout(async () => {
      setState((previous) => ({ status: 'loading', artworks: previous.artworks }))
      try {
        const response = await fetch(buildUrl(search), { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`)
        }
        const payload = (await response.json()) as { data: Artwork[]; total: number }
        setState({ status: 'ready', artworks: payload.data, total: payload.total })
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error)
          setState((previous) => ({ status: 'error', artworks: previous.artworks }))
        }
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [search, attempt])

  const retry = useCallback(() => setAttempt((count) => count + 1), [])

  return { state, retry }
}
