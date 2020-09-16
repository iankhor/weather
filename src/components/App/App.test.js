import React from 'react'
import App from 'components/App/App'
import { render, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import useSearchCity from 'components/hooks/useSearchCity'
import useSearchWeather from 'components/hooks/useSearchWeather'

jest.mock('components/hooks/useSearchCity')
jest.mock('components/hooks/useSearchWeather')

beforeEach(() => {
  useSearchCity.mockReturnValue({})
  useSearchWeather.mockReturnValue({})
})

describe('<App/>', () => {
  describe('searching for a location', () => {
    function subject() {
      render(<App />)

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
  })
})
