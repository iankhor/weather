import React from 'react'
import App from './App'
import { render, screen } from '@testing-library/react'

describe('<App/>', () => {
  it('renders', () => {
    render(<App />)

    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
