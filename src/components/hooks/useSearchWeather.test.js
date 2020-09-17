import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { renderHook, act } from '@testing-library/react-hooks'

import useSearchWeather, { searchWeatherUrl } from './useSearchWeather'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useSearchStation hook', () => {
  function subject(stationName = '', data = {}, status = '200') {
    const url = searchWeatherUrl(stationName)
    server.use(
      rest.get(url, (_req, res, ctx) => {
        return res(ctx.status(status), ctx.json(data))
      })
    )

    return renderHook(() => useSearchWeather())
  }

  describe('initial states', () => {
    it('sets success as null', () => {
      const { result } = subject()

      expect(result.current.success).toBeNull()
    })

    it('sets feed as null', () => {
      const { result } = subject()

      expect(result.current.feed).toBeNull()
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

  describe('while searching', () => {
    it('sets success as null', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne')

      act(() => {
        result.current.searchWeather('Melbourne')
      })
      expect(result.current.success).toBeNull()
      await waitForNextUpdate()
    })

    it('sets feed as null', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne')

      act(() => {
        result.current.searchWeather('Melbourne')
      })
      expect(result.current.feed).toBeNull()
      await waitForNextUpdate()
    })

    it('sets loading as true', async () => {
      const { result, waitFor, waitForNextUpdate } = subject('Melbourne')

      act(() => {
        result.current.searchWeather('Melbourne')
      })

      await waitFor(() => {
        expect(result.current.loading).toBeTruthy()
      })
      await waitForNextUpdate()
    })

    it('sets error as null', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne')

      act(() => {
        result.current.searchWeather('Melbourne')
      })
      expect(result.current.error).toBe('')
      await waitForNextUpdate()
    })
  })

  describe('successful search', () => {
    const feedData = {
      data: {
        aqi: 71,
        city: {
          name: 'Melbourne, CBD',
          url: 'ww.url1.com',
          geo: ['2', '3'],
        },
        attributions: [
          {
            url: 'ww.url2.com',
            name: 'something',
          },
        ],
      },
    }

    it('sets success to true', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne', feedData)

      act(() => {
        result.current.searchWeather('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.success).toBeTruthy()
    })

    it('sets feed', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne', feedData)

      act(() => {
        result.current.searchWeather('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.feed).toEqual({
        cityName: 'Melbourne, CBD',
        geoLocation: { lat: '2', lng: '3' },
        url: 'ww.url1.com',
        aqi: 71,
      })
    })

    it('sets loading to false', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne', feedData)

      act(() => {
        result.current.searchWeather('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.loading).toBeFalsy()
    })

    it('does not set error', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne', feedData)

      act(() => {
        result.current.searchWeather('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.error).toBe('')
    })
  })

  describe('failed search', () => {
    it('sets success to false', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne', {}, '500')

      act(() => {
        result.current.searchWeather('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.success).toBeFalsy()
    })

    it('sets feed as null', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne', '500')

      act(() => {
        result.current.searchWeather('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.feed).toBeNull()
    })

    it('sets loading to false', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne', {}, '500')

      act(() => {
        result.current.searchWeather('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.loading).toBeFalsy()
    })

    it('sets error message', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne', {}, '500')

      act(() => {
        result.current.searchWeather('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.error).toBe(
        'Something went wrong. Please try again'
      )
    })
  })
})
