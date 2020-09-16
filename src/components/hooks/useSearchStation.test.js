import { rest } from 'msw'
import axios from 'axios'
import { searchStationUrl } from './useSearchStation'
import { stationsData } from 'testLib/fixtures'

import { setupServer } from 'msw/node'
const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useSearchStation hook', () => {
  describe('successful search', () => {
    const url = searchStationUrl('Melbourne')
    server.use(
      rest.get(url, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(JSON.stringify(stationsData)))
      })
    )

    it('returns ...', async () => {
      try {
        const data = await axios.get(url)
        console.log(data)
      } catch (e) {
        console.log(e)
      }

      expect(1).toBe(1)
    })
  })
})
