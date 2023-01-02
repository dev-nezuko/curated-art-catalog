/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import ArtworkCard from '../../components/ArtworkCard'
import { artworks } from '../../data/artworks'

describe('ArtworkCard', () => {
  it('renders a wall label with title, artist, year and medium', () => {
    const manet = artworks.find((artwork) => artwork.artist === 'Édouard Manet')!
    render(
      <ul>
        <ArtworkCard artwork={manet} />
      </ul>
    )

    expect(screen.getByRole('heading', { level: 2, name: "Le Déjeuner sur l'herbe" })).toBeInTheDocument()
    expect(screen.getByText(/Édouard Manet/)).toHaveTextContent('Édouard Manet, 1863')
    expect(screen.getByText('Oil on canvas')).toBeInTheDocument()
  })

  it('keeps the decorative canvas out of the accessibility tree', () => {
    const { container } = render(
      <ul>
        <ArtworkCard artwork={artworks[0]} />
      </ul>
    )

    const canvas = container.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(canvas).not.toBeNull()
    expect(canvas.style.getPropertyValue('--tone-a')).toBe(artworks[0].tones[0])
  })
})
