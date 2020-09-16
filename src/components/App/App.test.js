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
    cities: [],
    searchStation: jest.fn(),
    ...mocks,
  }
}

function buildUseSearchWeather(mocks) {
  return {
    loading: false,
    success: null,
    data: buildCityWeatherData(),
    searchWeatherForCity: jest.fn(),
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
          })
          const { searchButton } = subject({ useSearchStationMocks })

          user.click(searchButton)

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
          })
          const { searchButton } = subject({ useSearchStationMocks })

          user.click(searchButton)

          expect(
            screen.queryByRole('list', { name: 'Stations' })
          ).not.toBeInTheDocument()
        })
      })

      describe('search for successful', () => {
        it('shows a list of stations', () => {
          const useSearchStationMocks = buildUseSearchStationMocks({
            success: true,
            data: ['Melbourne CBD', 'Alphington'],
          })
          const { searchButton } = subject({ useSearchStationMocks })

          user.click(searchButton)

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
            data: ['Melbourne CBD', 'Alphington'],
          })
          const { searchButton } = subject({ useSearchStationMocks })

          user.click(searchButton)

          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })
      })

      describe('search has failed', () => {})
    })
  })
})
