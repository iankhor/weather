import { rest } from 'msw'
import { setupServer } from 'msw/node'
import axios from 'axios'

const server = setupServer(
  rest.get('/greeting', (req, res, ctx) => {
    return res(ctx.json({ greeting: 'hello there' }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useSearchStation hook', () => {
  test('magic', async () => {
    server.use(
      rest.get('https://api.url', (req, res, ctx) => {
        return res(ctx.status(200))
      })
    )

    try {
      const data = await axios.get('https://api.url')
      console.log(data)
    } catch (e) {
      console.log(e)
    }
  })
})
