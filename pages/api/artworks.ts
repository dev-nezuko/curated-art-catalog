import type { NextApiRequest, NextApiResponse } from 'next'
import { Artwork, artworks } from '../../data/artworks'
import { matchArtworks, normalizeLimit, normalizeQuery } from '../../lib/artworkFilters'

export type ArtworksResponse = {
  data: Artwork[]
  total: number
  returned: number
}

export type ErrorResponse = {
  error: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ArtworksResponse | ErrorResponse>
) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const matches = matchArtworks(artworks, normalizeQuery(req.query.search))
  const page = matches.slice(0, normalizeLimit(req.query.limit))

  return res.status(200).json({
    data: page,
    total: matches.length,
    returned: page.length,
  })
}
