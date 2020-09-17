import React from 'react'
import App from 'components/App/App'
import { render, screen, within } from '@testing-library/react'
import user from '@testing-library/user-event'
import useStations from 'components/App/hooks/useStations'
import useFeed from 'components/App/hooks/useFeed'
import { buildCityWeatherData } from 'testLib/factories'

jest.mock('components/App/hooks/useStations')
jest.mock('components/App/hooks/useFeed')

function buildUseStationsMocks(mocks) {
  return {
    loading: false,
    success: null,
    stations: [],
    fetchStations: jest.fn(),
    error: '',
    ...mocks,
  }
}

function buildUseFeedMocks(mocks) {
  return {
    loading: false,
    success: null,
    feed: {},
    fetchFeed: jest.fn(),
    resetFeed: jest.fn(),
    error: '',
    ...mocks,
  }
}

const defaultSearchStationMocks = {}

describe('<App/>', () => {
  describe('searching for a location', () => {
    function subject({
      useStationsMocks = buildUseStationsMocks(),
      useFeedMocks = buildUseFeedMocks(),
    } = {}) {
      useStations.mockReturnValue(useStationsMocks)
      useFeed.mockReturnValue(useFeedMocks)

      render(<App />)
      const searchField = screen.getByRole('textbox', {
        name: 'Search for a station',
      })

      const searchButton = screen.getByRole('button', {
        name: 'Search',
      })

      return { searchField, searchButton }
    }

    it('has a search bar', () => {
      const { searchField } = subject()

      expect(searchField).toBeInTheDocument()
    })

    it('has a search button', () => {
      const { searchButton } = subject()

      expect(searchButton).toBeInTheDocument()
    })

    it('shows what the user has typed into the search field', () => {
      const { searchField } = subject()

      user.type(searchField, 'Melbourne')
      expect(searchField).toHaveValue('Melbourne')
    })

    describe('clicking on the search button', () => {
      describe('while searching', () => {
        it('shows Loading to show search progress', () => {
          const useStationsMocks = buildUseStationsMocks({
            loading: true,
            success: null,
          })
          subject({ useStationsMocks })

          expect(
            screen.getByRole('status', { name: 'progress' })
          ).toBeInTheDocument()
        })

        it('has called the search function of the useStations hook ', () => {
          const searchStationSpy = jest.fn()
          const useStationsMocks = buildUseStationsMocks({
            loading: true,
            fetchStations: searchStationSpy,
          })

          const { searchField, searchButton } = subject({
            useStationsMocks,
          })

          user.type(searchField, 'Melbourne')
          user.click(searchButton)

          expect(searchStationSpy).toHaveBeenNthCalledWith(1, 'Melbourne')
        })

        it('does not show list of stations', () => {
          const useStationsMocks = buildUseStationsMocks({
            loading: true,
            success: null,
          })
          subject({ useStationsMocks })

          expect(
            screen.queryByRole('list', { name: 'Stations' })
          ).not.toBeInTheDocument()
        })
      })

      describe('search for successful', () => {
        it('shows a list of stations', () => {
          const useStationsMocks = buildUseStationsMocks({
            success: true,
            stations: ['Melbourne CBD', 'Alphington'],
          })
          subject({ useStationsMocks })

          const stationList = screen.getByRole('list', { name: 'Stations' })
          const listItems = within(stationList)
            .getAllByRole('listitem')
            .map((i) => i.textContent)

          expect(stationList).toBeVisible()
          expect(listItems).toHaveLength(2)
          expect(listItems).toContain('Melbourne CBD')
          expect(listItems).toContain('Alphington')
        })

        it('does not show loader', () => {
          const useStationsMocks = buildUseStationsMocks({
            success: true,
            stations: ['Melbourne CBD', 'Alphington'],
          })
          const { searchButton } = subject({ useStationsMocks })

          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })
      })

      describe('search has failed', () => {
        it('shows an error message', () => {
          const useStationsMocks = buildUseStationsMocks({
            success: false,
            error: 'Something went wrong. Please try again',
          })
          subject({ useStationsMocks })

          const errorText = screen.getByText(
            'Something went wrong. Please try again'
          )

          expect(errorText).toBeInTheDocument()
        })
      })
    })

    describe('selecting a station to obtain weather data', () => {
      describe('while fetching weather data', () => {
        it('shows Loading to show search progress', () => {
          const useFeedMocks = buildUseFeedMocks({
            loading: true,
          })
          subject({ useFeedMocks })

          expect(
            screen.getByRole('status', { name: 'progress' })
          ).toBeInTheDocument()
        })

        it('has called the search function of the useFeed hook when a station is selected', () => {
          const useStationsMocks = buildUseStationsMocks({
            stations: ['Melbourne CBD', 'Alphington'],
          })

          const searchWeartherSpy = jest.fn()
          const useFeedMocks = buildUseFeedMocks({
            fetchFeed: searchWeartherSpy,
          })

          subject({ useStationsMocks, useFeedMocks })

          const selection = screen.getByRole('listitem', { name: 'Alphington' })
          user.click(selection)

          expect(searchWeartherSpy).toHaveBeenNthCalledWith(1, 'Alphington')
        })
      })

      describe('fetching weather data succeeded', () => {
        const weatherData = buildCityWeatherData({
          cityName: 'Sydney',
          geoLocation: {
            lat: '99',
            lng: '88',
          },
          aqi: '123',
          url: 'www.url',
        })

        it('show weather data', () => {
          const useStationsMocks = buildUseStationsMocks({
            stations: ['Melbourne CBD', 'Alphington'],
          })

          const useFeedMocks = buildUseFeedMocks({
            success: true,
            feed: weatherData,
          })
          subject({ useStationsMocks, useFeedMocks })

          const weatherInfo = screen.getByRole('article', {
            name: 'weather info',
          })

          expect(within(weatherInfo).getByText('Sydney')).toBeInTheDocument()
          expect(within(weatherInfo).getByText(/99/)).toBeInTheDocument()
          expect(within(weatherInfo).getByText(/88/)).toBeInTheDocument()
          expect(within(weatherInfo).getByText(/123/)).toBeInTheDocument()
        })

        it('does not show loader', () => {
          const weatherData = buildCityWeatherData()
          const useFeedMocks = buildUseFeedMocks({
            success: true,
            feed: weatherData,
          })
          subject({ useFeedMocks })

          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })

        it('does not show station list', () => {
          const useStationsMocks = buildUseStationsMocks({
            stations: ['Melbourne CBD', 'Alphington'],
          })

          const useFeedMocks = buildUseFeedMocks({
            success: true,
            feed: weatherData,
          })

          subject({ useStationsMocks, useFeedMocks })

          expect(
            screen.queryByRole('list', { name: 'Stations' })
          ).not.toBeInTheDocument()
        })
      })

      describe('fetching weather data failed', () => {
        it('shows an error message', () => {
          const useFeedMocks = buildUseFeedMocks({
            success: false,
            error: 'foobaz eror',
          })
          subject({ useFeedMocks })

          const errorText = screen.getByText('foobaz eror')

          expect(errorText).toBeInTheDocument()
        })
      })
    })
  })
})
