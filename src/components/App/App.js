import React, { useState } from 'react'

export default function App() {
  const [city, setCity] = useState('')

  return (
    <div className="cf">
      <label htmlFor="city" className="f6 b db mb2">
        <span className="normal black-60">Search for a city</span>
      </label>
      <input
        id="city"
        className="f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns"
        placeholder="Enter a city or a station name"
        type="text"
        value={city || ''}
        onChange={({ target: { value } }) => setCity(value)}
      />
      <button className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns">
        Search
      </button>
      <small className="f6 black-60 db mb2">
        You can search by the suburb or station name
      </small>
    </div>
  )
}
