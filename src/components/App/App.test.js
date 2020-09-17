import React from 'react'
import App from 'components/App/App'
import { render, screen, within } from '@testing-library/react'
import user from '@testing-library/user-event'
import useSearchStation from 'components/hooks/useSearchStation'
import useSearchWeather from 'components/hooks/useSearchWeather'
import { buildCityWeatherData } from 'testLib/factories'

jest.mock('components/hooks/useSearchStation')
jest.mock('components/hooks/useSearchWeather')

function buildUseSearchStationMocks(mocks) {
  return {
    loading: false,
    success: null,
    stations: [],
    searchStation: jest.fn(),
    error: '',
    ...mocks,
  }
}

function buildUseSearchWeather(mocks) {
  return {
    loading: false,
    success: null,
    feed: {},
    searchWeather: jest.fn(),
    error: '',
    ...mocks,
  }
}

const defaultSearchStationMocks = {}

describe('<App/>', () => {
  describe('searching for a location', () => {
    function subject({
      useSearchStationMocks = buildUseSearchStationMocks(),
      useSearchWeatherMocks = buildUseSearchWeather(),
    } = {}) {
      useSearchStation.mockReturnValue(useSearchStationMocks)
      useSearchWeather.mockReturnValue(useSearchWeatherMocks)

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
          const useSearchStationMocks = buildUseSearchStationMocks({
            loading: true,
            success: null,
          })
          subject({ useSearchStationMocks })

          expect(
            screen.getByRole('status', { name: 'progress' })
          ).toBeInTheDocument()
        })

        it('has called the search function of the useSearchStation hook ', () => {
          const searchStationSpy = jest.fn()
          const useSearchStationMocks = buildUseSearchStationMocks({
            loading: true,
            searchStation: searchStationSpy,
          })

          const { searchField, searchButton } = subject({
            useSearchStationMocks,
          })

          user.type(searchField, 'Melbourne')
          user.click(searchButton)

          expect(searchStationSpy).toHaveBeenNthCalledWith(1, 'Melbourne')
        })

        it('does not show list of stations', () => {
          const useSearchStationMocks = buildUseSearchStationMocks({
            loading: true,
            success: null,
          })
          subject({ useSearchStationMocks })

          expect(
            screen.queryByRole('list', { name: 'Stations' })
          ).not.toBeInTheDocument()
        })
      })

      describe('search for successful', () => {
        it('shows a list of stations', () => {
          const useSearchStationMocks = buildUseSearchStationMocks({
            success: true,
            stations: ['Melbourne CBD', 'Alphington'],
          })
          subject({ useSearchStationMocks })

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
          const useSearchStationMocks = buildUseSearchStationMocks({
            success: true,
            stations: ['Melbourne CBD', 'Alphington'],
          })
          const { searchButton } = subject({ useSearchStationMocks })

          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })
      })

      describe('search has failed', () => {
        it('shows an error message', () => {
          const useSearchStationMocks = buildUseSearchStationMocks({
            success: false,
            error: 'Something went wrong. Please try again',
          })
          subject({ useSearchStationMocks })

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
          const useSearchWeatherMocks = buildUseSearchWeather({
            loading: true,
          })
          subject({ useSearchWeatherMocks })

          expect(
            screen.getByRole('status', { name: 'progress' })
          ).toBeInTheDocument()
        })

        it('has called the search function of the useSearchWeather hook when a station is selected', () => {
          const useSearchStationMocks = buildUseSearchStationMocks({
            stations: ['Melbourne CBD', 'Alphington'],
          })

          const searchWeartherSpy = jest.fn()
          const useSearchWeatherMocks = buildUseSearchWeather({
            searchWeather: searchWeartherSpy,
          })

          subject({ useSearchStationMocks, useSearchWeatherMocks })

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
          const useSearchStationMocks = buildUseSearchStationMocks({
            stations: ['Melbourne CBD', 'Alphington'],
          })

          const useSearchWeatherMocks = buildUseSearchWeather({
            success: true,
            feed: weatherData,
          })
          subject({ useSearchStationMocks, useSearchWeatherMocks })

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
          const useSearchWeatherMocks = buildUseSearchWeather({
            success: true,
            feed: weatherData,
          })
          subject({ useSearchWeatherMocks })

          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })

        it('does not show station list', () => {
          const useSearchStationMocks = buildUseSearchStationMocks({
            stations: ['Melbourne CBD', 'Alphington'],
          })

          const useSearchWeatherMocks = buildUseSearchWeather({
            success: true,
            feed: weatherData,
          })

          subject({ useSearchStationMocks, useSearchWeatherMocks })

          expect(
            screen.queryByRole('list', { name: 'Stations' })
          ).not.toBeInTheDocument()
        })
      })

      describe('fetching weather data failed', () => {
        it('shows an error message', () => {
          const useSearchWeatherMocks = buildUseSearchWeather({
            success: false,
            error: 'foobaz eror',
          })
          subject({ useSearchWeatherMocks })

          const errorText = screen.getByText('foobaz eror')

          expect(errorText).toBeInTheDocument()
        })
      })
    })
  })
})
