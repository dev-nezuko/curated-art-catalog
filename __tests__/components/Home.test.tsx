/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../../pages/index'
import { artworks } from '../../data/artworks'

const jsonResponse = (data: typeof artworks) =>
  ({ ok: true, status: 200, json: async () => ({ data, total: data.length, returned: data.length }) }) as Response

const fetchMock = jest.fn<Promise<Response>, [string, RequestInit?]>()

beforeEach(() => {
  fetchMock.mockReset()
  global.fetch = fetchMock as unknown as typeof fetch
})

const requestedUrl = (call: number) => new URL(fetchMock.mock.calls[call][0], 'http://localhost')

describe('Home', () => {
  it('loads the whole collection with the maximum page size', async () => {
    fetchMock.mockResolvedValue(jsonResponse(artworks))
    render(<Home />)

    const wall = await screen.findByRole('list', { name: 'Artworks' })
    await waitFor(() => expect(within(wall).getAllByRole('listitem')).toHaveLength(artworks.length))
    expect(screen.getByRole('status')).toHaveTextContent(`${artworks.length} works on view`)
    expect(requestedUrl(0).searchParams.get('limit')).toBe('50')
    expect(requestedUrl(0).searchParams.has('search')).toBe(false)
  })

  it('sends one debounced request for a typed search', async () => {
    fetchMock.mockResolvedValue(jsonResponse(artworks))
    render(<Home />)
    await screen.findByText(`${artworks.length} works on view`)

    fetchMock.mockResolvedValue(jsonResponse([artworks[2]]))
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search the collection' }), 'mona')

    expect(await screen.findByText('1 work match “mona”')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(requestedUrl(1).searchParams.get('search')).toBe('mona')
    expect(screen.getByRole('heading', { name: 'Mona Lisa' })).toBeInTheDocument()
  })

  it('offers a way back from an empty search', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]))
    render(<Home />)
    const input = screen.getByRole('searchbox')
    await userEvent.type(input, 'fresco')

    expect(await screen.findByRole('heading', { name: 'Nothing on the walls for “fresco”' })).toBeInTheDocument()

    fetchMock.mockResolvedValue(jsonResponse(artworks))
    await userEvent.click(screen.getByRole('button', { name: 'Show the whole collection' }))

    expect(input).toHaveValue('')
    expect(await screen.findByText(`${artworks.length} works on view`)).toBeInTheDocument()
  })

  it('shows an error and retries on request', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    fetchMock.mockResolvedValueOnce({ ok: false, status: 503, json: async () => ({}) } as Response)
    render(<Home />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('The collection is closed for a moment')
    expect(screen.getByRole('status')).toHaveTextContent('could not be loaded')

    fetchMock.mockResolvedValue(jsonResponse(artworks))
    await userEvent.click(within(alert).getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText(`${artworks.length} works on view`)).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    consoleError.mockRestore()
  })

  it('shows placeholders, not an empty state, while the first request is pending', () => {
    fetchMock.mockReturnValue(new Promise(() => undefined))
    render(<Home />)

    expect(screen.getByRole('status')).toHaveTextContent('Looking through the collection')
    expect(screen.queryByText(/Nothing on the walls/)).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Artworks' })).toHaveAttribute('aria-busy', 'true')
  })
})
