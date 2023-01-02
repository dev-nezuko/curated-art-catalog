import { useId, useState } from 'react'
import Head from 'next/head'
import ArtworkCard from '../components/ArtworkCard'
import { useArtworkSearch } from '../lib/useArtworkSearch'
import styles from '../styles/Home.module.css'

const plural = (count: number) => `${count} work${count === 1 ? '' : 's'}`

const Home = () => {
  const [search, setSearch] = useState('')
  const { state, retry } = useArtworkSearch(search)
  const searchId = useId()
  const hintId = useId()

  const statusText =
    state.status === 'loading'
      ? 'Looking through the collection…'
      : state.status === 'error'
        ? 'The collection could not be loaded.'
        : search.trim()
          ? `${plural(state.total)} match “${search.trim()}”`
          : `${plural(state.total)} on view`

  const isEmpty = state.status === 'ready' && state.artworks.length === 0

  return (
    <>
      <Head>
        <title>Gallery Space · Permanent collection</title>
        <meta name="description" content="Search a small permanent collection by title, artist, medium or year." />
      </Head>

      <div className={styles.page}>
        <header className={styles.masthead}>
          <p className={styles.kicker}>Gallery Space</p>
          <h1 className={styles.title}>The permanent collection</h1>
          <p className={styles.intro}>
            Five centuries of painting and print in one room. Search by title, artist, medium or year; accents are optional.
          </p>
        </header>

        <main className={styles.main}>
          <form className={styles.search} role="search" onSubmit={(event) => event.preventDefault()}>
            <label className={styles.searchLabel} htmlFor={searchId}>
              Search the collection
            </label>
            <input
              id={searchId}
              className={styles.searchInput}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="velazquez, woodblock, 1889"
              aria-describedby={hintId}
              autoComplete="off"
            />
            <p id={hintId} className={styles.status} role="status" aria-live="polite">
              {statusText}
            </p>
          </form>

          {state.status === 'error' ? (
            <section className={styles.notice} role="alert">
              <h2>The collection is closed for a moment</h2>
              <p>We could not reach the catalogue. Check your connection and try again.</p>
              <button type="button" className={styles.button} onClick={retry}>
                Try again
              </button>
            </section>
          ) : null}

          {isEmpty ? (
            <section className={styles.notice}>
              <h2>Nothing on the walls for “{search.trim()}”</h2>
              <p>Try an artist&apos;s surname, a medium such as “canvas”, or a year.</p>
              <button type="button" className={styles.button} onClick={() => setSearch('')}>
                Show the whole collection
              </button>
            </section>
          ) : null}

          <ul
            className={styles.wall}
            aria-label="Artworks"
            aria-busy={state.status === 'loading'}
            data-stale={state.status !== 'ready' || undefined}
          >
            {state.status === 'loading' && state.artworks.length === 0
              ? Array.from({ length: 6 }, (_, index) => (
                  <li key={index} className={`${styles.piece} ${styles.placeholder}`} aria-hidden="true">
                    <div className={styles.canvas} />
                    <div className={styles.placeholderLine} />
                  </li>
                ))
              : state.artworks.map((artwork) => <ArtworkCard key={artwork.id} artwork={artwork} />)}
          </ul>
        </main>

        <footer className={styles.footer}>
          <p>Catalogue data is local to this project; tones stand in for images.</p>
        </footer>
      </div>
    </>
  )
}

export default Home
