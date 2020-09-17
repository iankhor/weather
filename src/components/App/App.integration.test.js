import React from 'react'
import App from 'components/App/App'
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { buildSearchUrl } from './hooks/useStations'
import { buildFeedUrl } from './hooks/useFeed'
import user from '@testing-library/user-event'
import { rest } from 'msw'

import { stationsData, stationFeed } from '../../../testLib/fixtures'

import { setupServer } from 'msw/node'

const server = setupServer()
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function setupMock(stationName = 'Bangalore') {
  server.use(
    rest.get(buildSearchUrl(stationName), (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          data: stationsData,
        })
      )
    })
  )

  server.use(
    rest.get(buildFeedUrl(stationName), (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          data: stationFeed,
        })
      )
    })
  )
}

describe('getting air quality index of a station', () => {
  it('sees the air quality index', async () => {
    const stationName = 'Bangalore'
    setupMock(stationName)
    render(<App />)

    const searchField = screen.getByRole('textbox', {
      name: 'Search for a station',
    })

    const searchButton = screen.getByRole('button', {
      name: 'Search',
    })

    user.type(searchField, stationName)
    user.click(searchButton)

    await waitForElementToBeRemoved(() => screen.getByText('Loading...'))

    const selection = screen.getByRole('listitem', { name: 'Bangalore' })
    user.click(selection)

    await waitForElementToBeRemoved(() => screen.getByText('Loading...'))

    const apiText = screen.getByText(`${stationFeed.aqi}`)
    expect(apiText).toBeVisible()
  })
})
