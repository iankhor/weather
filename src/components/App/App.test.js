import React from 'react'
import App from 'components/App/App'
import { render, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import useSearchCity from 'components/hooks/useSearchCity'
import useSearchWeather from 'components/hooks/useSearchWeather'
import { buildCityWeatherData } from 'testLib/factories'

jest.mock('components/hooks/useSearchCity')
jest.mock('components/hooks/useSearchWeather')

function buildUseSearchCityMocks(mocks) {
  return {
    loading: false,
    success: null,
    cities: [],
    search: jest.fn(),
    ...mocks,
  }
}

function buildUseSearchWeather(mocks) {
  return {
    loading: false,
    success: null,
    data: buildCityWeatherData(),
    search: jest.fn(),
    ...mocks,
  }
}

const defaultSearchCityMocks = {}

describe('<App/>', () => {
  describe('searching for a location', () => {
    function subject({
      useSearchCityMocks = buildUseSearchCityMocks(),
      useSearchWeatherMocks = buildUseSearchWeather(),
    } = {}) {
      render(<App />)

      useSearchCity.mockReturnValueOnce(useSearchCityMocks)
      useSearchWeather.mockReturnValue(useSearchWeatherMocks)

      const searchField = screen.getByRole('textbox', {
        name: 'Search for a city',
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
      describe('while searching', () => {})

      describe('search for successful', () => {})

      describe('search has failed', () => {})
    })
  })
})
