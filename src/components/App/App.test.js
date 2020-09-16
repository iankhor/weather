import React from 'react'
import App from './App'
import { render, screen } from '@testing-library/react'

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
  })
})
