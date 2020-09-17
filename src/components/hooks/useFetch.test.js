import { rest } from 'msw'

import { setupServer } from 'msw/node'
import { renderHook, act } from '@testing-library/react-hooks'
import useFetch from './useFetch'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useFetch hook', () => {
  function subject(url = 'http://www.foobar.com', data = {}, status = '200') {
    server.use(
      rest.get(url, (_req, res, ctx) => {
        return res(ctx.status(status), ctx.json(data))
      })
    )

    return renderHook(() => useFetch())
  }

  describe('initial states', () => {
    it('sets success as null', () => {
      const { result } = subject()

      expect(result.current.success).toBeNull()
    })

    it('sets data as null', () => {
      const { result } = subject()

      expect(result.current.data).toBeNull()
    })

    it('sets loading as false', () => {
      const { result } = subject()

      expect(result.current.loading).toBeFalsy()
    })

    it('sets error as null', () => {
      const { result } = subject()

      expect(result.current.error).toBe('')
    })
  })

  describe('while fetching', () => {
    it('sets success as null', async () => {
      const { result, waitForNextUpdate } = subject('http://foo.url')

      act(() => {
        result.current.fetch('http://foo.url')
      })
      expect(result.current.success).toBeNull()
      await waitForNextUpdate()
    })

    it('sets data as null', async () => {
      const { result, waitForNextUpdate } = subject('http://foo.url')

      act(() => {
        result.current.fetch('http://foo.url')
      })
      expect(result.current.data).toBeNull()
      await waitForNextUpdate()
    })

    it('sets loading as true', async () => {
      const { result, waitFor, waitForNextUpdate } = subject('http://foo.url')

      act(() => {
        result.current.fetch('http://foo.url')
      })

      await waitFor(() => {
        expect(result.current.loading).toBeTruthy()
      })
      await waitForNextUpdate()
    })

    it('sets error as null', async () => {
      const { result, waitForNextUpdate } = subject('http://foo.url')

      act(() => {
        result.current.fetch('http://foo.url')
      })
      expect(result.current.error).toBe('')
      await waitForNextUpdate()
    })
  })

  describe('successful search', () => {
    const axiosData = {
      data: { foo: 'bar' },
    }

    it('sets success to true', async () => {
      const { result, waitForNextUpdate } = subject(
        'http://foorbar.url',
        axiosData
      )

      act(() => {
        result.current.fetch('http://foorbar.url')
      })
      await waitForNextUpdate()

      expect(result.current.success).toBeTruthy()
    })

    it('sets data', async () => {
      const { result, waitForNextUpdate } = subject(
        'http://foorbar.url',
        axiosData
      )

      act(() => {
        result.current.fetch('http://foorbar.url')
      })
      await waitForNextUpdate()

      expect(result.current.data).toEqual({ foo: 'bar' })
    })

    it('sets loading to false', async () => {
      const { result, waitForNextUpdate } = subject(
        'http://foorbar.url',
        axiosData
      )

      act(() => {
        result.current.fetch('http://foorbar.url')
      })
      await waitForNextUpdate()

      expect(result.current.loading).toBeFalsy()
    })

    it('does not set error', async () => {
      const { result, waitForNextUpdate } = subject(
        'http://foorbar.url',
        axiosData
      )

      act(() => {
        result.current.fetch('http://foorbar.url')
      })
      await waitForNextUpdate()

      expect(result.current.error).toBe('')
    })
  })

  describe('failed fetch', () => {
    it('sets success to false', async () => {
      const { result, waitForNextUpdate } = subject(
        'http://foorbar.url',
        {},
        '500'
      )

      act(() => {
        result.current.fetch('http://foorbar.url')
      })
      await waitForNextUpdate()

      expect(result.current.success).toBeFalsy()
    })

    it('sets data as null', async () => {
      const { result, waitForNextUpdate } = subject(
        'http://foorbar.url',
        {},
        '500'
      )

      act(() => {
        result.current.fetch('http://foorbar.url')
      })
      await waitForNextUpdate()

      expect(result.current.data).toBeNull()
    })

    it('sets loading to false', async () => {
      const { result, waitForNextUpdate } = subject(
        'http://foorbar.url',
        {},
        '500'
      )

      act(() => {
        result.current.fetch('http://foorbar.url')
      })
      await waitForNextUpdate()

      expect(result.current.loading).toBeFalsy()
    })

    it('sets error message', async () => {
      const { result, waitForNextUpdate } = subject(
        'http://foorbar.url',
        {},
        '500'
      )

      act(() => {
        result.current.fetch('http://foorbar.url')
      })
      await waitForNextUpdate()

      expect(result.current.error).toBe(
        'Something went wrong. Please try again'
      )
    })
  })
})
