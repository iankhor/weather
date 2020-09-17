import { rest } from 'msw'
import axios from 'axios'
import { searchStationUrl } from './useSearchStation'

import { setupServer } from 'msw/node'
import { renderHook, act } from '@testing-library/react-hooks'
import useSearchStation from './useSearchStation'
import { stationsData } from 'testLib/fixtures'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useSearchStation hook', () => {
  function subject(stationName = '', data = [], status = '200') {
    const url = searchStationUrl(stationName)
    server.use(
      rest.get(url, (_req, res, ctx) => {
        return res(ctx.status(status), ctx.json(data))
      })
    )

    return renderHook(() => useSearchStation())
  }

  describe('initial states', () => {
    it('sets success as null', () => {
      const { result } = subject()

      expect(result.current.success).toBeNull()
    })

    it('sets stations as null', () => {
      const { result } = subject()

      expect(result.current.stations).toBeNull()
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
        result.current.searchStation('Melbourne')
      })
      expect(result.current.success).toBeNull()
      await waitForNextUpdate()
    })

    it('sets stations as null', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne')

      act(() => {
        result.current.searchStation('Melbourne')
      })
      expect(result.current.stations).toBeNull()
      await waitForNextUpdate()
    })

    it('sets loading as true', async () => {
      const { result, waitFor, waitForNextUpdate } = subject('Melbourne')

      act(() => {
        result.current.searchStation('Melbourne')
      })

      await waitFor(() => {
        expect(result.current.loading).toBeTruthy()
      })
      await waitForNextUpdate()
    })

    it('sets error as null', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne')

      act(() => {
        result.current.searchStation('Melbourne')
      })
      expect(result.current.error).toBe('')
      await waitForNextUpdate()
    })
  })

  describe('successful search', () => {
    const stationsData = {
      data: [
        {
          station: {
            name: 'Melbourne, CBD',
          },
        },
        {
          station: {
            name: 'Alphington',
          },
        },
      ],
    }

    it('sets success to true', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne', stationsData)

      act(() => {
        result.current.searchStation('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.success).toBeTruthy()
    })

    it('sets stations', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne', stationsData)

      act(() => {
        result.current.searchStation('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.stations).toContain('Melbourne, CBD')
      expect(result.current.stations).toContain('Alphington')
    })

    it('sets loading to false', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne', stationsData)

      act(() => {
        result.current.searchStation('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.loading).toBeFalsy()
    })

    it('does not set error', async () => {
      const { result, waitForNextUpdate } = subject('Melbourne', stationsData)

      act(() => {
        result.current.searchStation('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.error).toBe('')
    })
  })

  describe('failed search', () => {
    it('sets success to false', async () => {
      const { result, waitForNextUpdate } = subject(
        'Melbourne',
        stationsData,
        '500'
      )

      act(() => {
        result.current.searchStation('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.success).toBeFalsy()
    })

    it('sets stations as null', async () => {
      const { result, waitForNextUpdate } = subject(
        'Melbourne',
        stationsData,
        '500'
      )

      act(() => {
        result.current.searchStation('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.stations).toBeNull()
    })

    it('sets loading to false', async () => {
      const { result, waitForNextUpdate } = subject(
        'Melbourne',
        stationsData,
        '500'
      )

      act(() => {
        result.current.searchStation('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.loading).toBeFalsy()
    })

    it('sets error message', async () => {
      const { result, waitForNextUpdate } = subject(
        'Melbourne',
        stationsData,
        '500'
      )

      act(() => {
        result.current.searchStation('Melbourne')
      })
      await waitForNextUpdate()

      expect(result.current.error).toBe(
        'Something went wrong. Please try again'
      )
    })
  })
})
