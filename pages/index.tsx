import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Artwork } from '../data/artworks'

const Home = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [search, setSearch] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchArtworks = async () => {
      try {
        const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''
        const response = await fetch(`/api/artworks${query}`, { signal: controller.signal })

        if (!response.ok) {
          throw new Error('Unable to fetch artworks')
        }

        const payload = (await response.json()) as { data: Artwork[] }

        if (isMounted) {
          setArtworks(payload.data)
          setError('')
        }
      } catch {
        if (isMounted) {
          setError('Could not load artworks right now. Please try again.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    setIsLoading(true)
    fetchArtworks()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [search])

  const resultLabel = useMemo(() => {
    if (isLoading) {
      return 'Loading artworks...'
    }

    if (error) {
      return error
    }

    return `${artworks.length} artwork${artworks.length === 1 ? '' : 's'} found`
  }, [artworks.length, error, isLoading])

  return (
    <div className={styles.container}>
      <Head>
        <title>Art Gallery</title>
        <meta name="description" content="Search and browse curated artworks." />
      </Head>

      <main className={styles.main}>
        <p className={styles.eyebrow}>THE STUDY COLLECTION · 01</p>
        <h1 className={styles.title}>A closer look.</h1>

        <p className={styles.description}>
          Five familiar works, catalogued by artist, medium, and year. A text-only collection for curious browsing.
        </p>

        <label className={styles.searchLabel} htmlFor="search">
          Search artwork
        </label>
        <input
          id="search"
          className={styles.searchInput}
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Try: van gogh, canvas, mona"
        />

        <p className={styles.resultLabel} role="status" aria-live="polite">{resultLabel}</p>
        {!isLoading && !error && artworks.length === 0 && <p className={styles.empty}>No matches in this small collection. Try an artist or clear the search.</p>}

        <div className={styles.grid} aria-busy={isLoading}>
          {!isLoading && !error && artworks.map((artwork) => (
            <article key={artwork.id} className={styles.card}>
              <span className={styles.catalogueNumber}>CAT. {String(artwork.id).padStart(2, '0')}</span>
              <h2>{artwork.title}</h2>
              <p>{artwork.artist}</p>
              <p className={styles.year}>{artwork.year}</p>
              <p>{artwork.medium}</p>
            </article>
          ))}
        </div>
        <footer className={styles.footer}>A catalogue of five works · Metadata only, no artwork reproductions</footer>
      </main>
    </div>
  )
}

export default Home
