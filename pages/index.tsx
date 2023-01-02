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

    const fetchArtworks = async () => {
      try {
        const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''
        const response = await fetch(`/api/artworks${query}`)

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
        <h1 className={styles.title}>Art Gallery</h1>

        <p className={styles.description}>
          Explore classic artwork and filter by title, artist, or medium.
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

        <p className={styles.resultLabel}>{resultLabel}</p>

        <div className={styles.grid}>
          {artworks.map((artwork) => (
            <article key={artwork.id} className={styles.card}>
              <h2>{artwork.title}</h2>
              <p>{artwork.artist}</p>
              <p>{artwork.year}</p>
              <p>{artwork.medium}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
