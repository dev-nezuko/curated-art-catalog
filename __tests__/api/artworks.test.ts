import type { NextApiRequest, NextApiResponse } from 'next'
import { createMocks } from 'node-mocks-http'
import handler from '../../pages/api/artworks'

type ErrorData = {
  error: string
}

type SuccessData = {
  data: Array<{ id: number }>
  total: number
  returned: number
}

const parseResponse = <T>(res: NextApiResponse): T => {
  return JSON.parse((res as unknown as { _getData: () => string })._getData()) as T
}

describe('/api/artworks', () => {
  it('returns artworks for GET requests', () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    handler(req as NextApiRequest, res as NextApiResponse)

    expect(res._getStatusCode()).toBe(200)
    const payload = parseResponse<SuccessData>(res as unknown as NextApiResponse)
    expect(payload.total).toBeGreaterThan(0)
    expect(payload.returned).toBe(payload.data.length)
  })

  it('filters results by search query', () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { search: 'mona' },
    })

    handler(req as NextApiRequest, res as NextApiResponse)

    expect(res._getStatusCode()).toBe(200)
    const payload = parseResponse<SuccessData>(res as unknown as NextApiResponse)
    expect(payload.total).toBe(1)
    expect(payload.returned).toBe(1)
  })

  it('parses decimal limits as bounded integers', () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { limit: '1.9' },
    })

    handler(req as NextApiRequest, res as NextApiResponse)

    expect(res._getStatusCode()).toBe(200)
    const payload = parseResponse<SuccessData>(res as unknown as NextApiResponse)
    expect(payload.returned).toBe(1)
  })

  it('rejects unsupported HTTP methods', () => {
    const { req, res } = createMocks({
      method: 'POST',
    })

    handler(req as NextApiRequest, res as NextApiResponse)

    expect(res._getStatusCode()).toBe(405)
    const payload = parseResponse<ErrorData>(res as unknown as NextApiResponse)
    expect(payload.error).toBe('Method Not Allowed')
  })
})
