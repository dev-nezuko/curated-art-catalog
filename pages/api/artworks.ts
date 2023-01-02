import type { NextApiRequest, NextApiResponse } from 'next'
import { artworks } from '../../data/artworks'
import { filterArtworks, normalizeLimit, normalizeQuery } from '../../lib/artworkFilters'

type SuccessData = {
  data: typeof artworks
  total: number
}

type ErrorData = {
  error: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessData | ErrorData>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const searchTerm = normalizeQuery(req.query.search)
    const limit = normalizeLimit(req.query.limit)
    const filtered = filterArtworks(artworks, searchTerm, limit)

    return res.status(200).json({
      data: filtered,
      total: filtered.length,
    })
  } catch {
    // Keeps API responses predictable in production failures.
    return res.status(500).json({ error: 'Unexpected server error' })
  }
}
