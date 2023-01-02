import type { CSSProperties } from 'react'
import type { Artwork } from '../data/artworks'
import styles from '../styles/Home.module.css'

type ArtworkCardProps = {
  artwork: Artwork
}

const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  const [first, second] = artwork.tones
  const canvasStyle = { '--tone-a': first, '--tone-b': second } as CSSProperties

  return (
    <li className={styles.piece}>
      <figure className={styles.frame}>
        <div className={styles.canvas} style={canvasStyle} aria-hidden="true" />
        <figcaption className={styles.label}>
          <h2 className={styles.pieceTitle}>{artwork.title}</h2>
          <p className={styles.artist}>
            {artwork.artist}, <span className={styles.year}>{artwork.year}</span>
          </p>
          <p className={styles.medium}>{artwork.medium}</p>
        </figcaption>
      </figure>
    </li>
  )
}

export default ArtworkCard
