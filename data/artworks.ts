export type Artwork = {
  id: number
  title: string
  artist: string
  year: number
  medium: string
}

export const artworks: Artwork[] = [
  {
    id: 1,
    title: 'Starry Night',
    artist: 'Vincent van Gogh',
    year: 1889,
    medium: 'Oil on canvas',
  },
  {
    id: 2,
    title: 'The Persistence of Memory',
    artist: 'Salvador Dali',
    year: 1931,
    medium: 'Oil on canvas',
  },
  {
    id: 3,
    title: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    year: 1503,
    medium: 'Oil on poplar panel',
  },
  {
    id: 4,
    title: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
    year: 1665,
    medium: 'Oil on canvas',
  },
  {
    id: 5,
    title: 'The Scream',
    artist: 'Edvard Munch',
    year: 1893,
    medium: 'Oil, tempera, pastel and crayon on cardboard',
  },
]
