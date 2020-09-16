import { rest } from 'msw'
import axios from 'axios'
import { searchStationUrl } from './useSearchStation'
import { stationsData } from 'testLib/fixtures'

import { setupServer } from 'msw/node'
import { renderHook } from '@testing-library/react-hooks'
import useSearchStation from './useSearchStation'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useSearchStation hook', () => {
  describe('successful search', () => {
    function subject(stationName, data) {
      const url = searchStationUrl(stationName)
      server.use(
        rest.get(url, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(JSON.stringify(data)))
        })
      )
    }

    it('returns ...', async () => {
      subject('Melbourne', stationsData)
      const url = searchStationUrl('Melbourne')

      const { result, waitFor } = renderHook(() => useSearchStation())

      result.current.search('Melbourne')

      await waitFor(() => {
        console.log(result)
      })
    })
  })
})
