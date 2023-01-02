import type { NextApiRequest, NextApiResponse } from 'next'
import { createMocks, RequestMethod } from 'node-mocks-http'
import handler, { ArtworksResponse, ErrorResponse } from '../../pages/api/artworks'
import { artworks } from '../../data/artworks'

const call = (method: RequestMethod, query: Record<string, string | string[]> = {}) => {
  const { req, res } = createMocks({ method, query })
  handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse)
  return res
}

const body = <T,>(res: ReturnType<typeof call>): T => JSON.parse(res._getData()) as T

describe('/api/artworks', () => {
  it('returns the collection for GET', () => {
    const res = call('GET')

    expect(res._getStatusCode()).toBe(200)
    const payload = body<ArtworksResponse>(res)
    expect(payload.total).toBe(artworks.length)
    expect(payload.returned).toBe(payload.data.length)
  })

  it('filters by search and reports the full match count', () => {
    const payload = body<ArtworksResponse>(call('GET', { search: 'canvas', limit: '1' }))

    expect(payload.returned).toBe(1)
    expect(payload.total).toBeGreaterThan(1)
  })

  it('matches accented artists from a plain query', () => {
    const payload = body<ArtworksResponse>(call('GET', { search: 'dali' }))
    expect(payload.data.map((a) => a.artist)).toEqual(['Salvador Dalí'])
  })

  it('floors decimal limits', () => {
    expect(body<ArtworksResponse>(call('GET', { limit: '1.9' })).returned).toBe(1)
  })

  it.each(['0.5', '-2', 'NaN', '0x2'])('ignores the invalid limit %s', (limit) => {
    expect(body<ArtworksResponse>(call('GET', { limit })).returned).toBe(artworks.length)
  })

  it('uses the first value of repeated parameters', () => {
    const payload = body<ArtworksResponse>(call('GET', { search: ['scream', 'mona'], limit: ['5', '1'] }))
    expect(payload.data.map((a) => a.title)).toEqual(['The Scream'])
  })

  it('answers HEAD like GET', () => {
    expect(call('HEAD')._getStatusCode()).toBe(200)
  })

  it.each(['POST', 'PUT', 'DELETE', 'PATCH'] as const)('rejects %s with 405 and an Allow header', (method) => {
    const res = call(method)

    expect(res._getStatusCode()).toBe(405)
    expect(res.getHeader('Allow')).toBe('GET, HEAD')
    expect(body<ErrorResponse>(res).error).toBe('Method Not Allowed')
  })
})
