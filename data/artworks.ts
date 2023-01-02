export type Artwork = {
  id: number
  title: string
  artist: string
  year: number
  medium: string
  // Two dominant tones of the work, used for the placeholder canvas instead of a remote image.
  tones: [string, string]
}

export const artworks: Artwork[] = [
  {
    id: 1,
    title: 'Starry Night',
    artist: 'Vincent van Gogh',
    year: 1889,
    medium: 'Oil on canvas',
    tones: ['#1f3a68', '#e2c044'],
  },
  {
    id: 2,
    title: 'The Persistence of Memory',
    artist: 'Salvador Dalí',
    year: 1931,
    medium: 'Oil on canvas',
    tones: ['#c58b3c', '#3d5a6c'],
  },
  {
    id: 3,
    title: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    year: 1503,
    medium: 'Oil on poplar panel',
    tones: ['#4b4a2a', '#a07b42'],
  },
  {
    id: 4,
    title: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
    year: 1665,
    medium: 'Oil on canvas',
    tones: ['#1b1c20', '#d7b25a'],
  },
  {
    id: 5,
    title: 'The Scream',
    artist: 'Edvard Munch',
    year: 1893,
    medium: 'Oil, tempera, pastel and crayon on cardboard',
    tones: ['#d4602c', '#2e4d63'],
  },
  {
    id: 6,
    title: 'Las Meninas',
    artist: 'Diego Velázquez',
    year: 1656,
    medium: 'Oil on canvas',
    tones: ['#3b2f26', '#b39a76'],
  },
  {
    id: 7,
    title: "Le Déjeuner sur l'herbe",
    artist: 'Édouard Manet',
    year: 1863,
    medium: 'Oil on canvas',
    tones: ['#3e4a2c', '#d9cdb4'],
  },
  {
    id: 8,
    title: 'The Great Wave off Kanagawa',
    artist: 'Katsushika Hokusai',
    year: 1831,
    medium: 'Woodblock print, ink and colour on paper',
    tones: ['#203f6b', '#e9dfc7'],
  },
  {
    id: 9,
    title: 'Impression, Sunrise',
    artist: 'Claude Monet',
    year: 1872,
    medium: 'Oil on canvas',
    tones: ['#5f7783', '#e0663a'],
  },
  {
    id: 10,
    title: 'The Kiss',
    artist: 'Gustav Klimt',
    year: 1908,
    medium: 'Oil and gold leaf on canvas',
    tones: ['#b8892b', '#3f4f2a'],
  },
  {
    id: 11,
    title: 'The Night Watch',
    artist: 'Rembrandt van Rijn',
    year: 1642,
    medium: 'Oil on canvas',
    tones: ['#2a2118', '#c9a14a'],
  },
]
