import React, { useState } from 'react'
import useSearchStation from 'components/hooks/useSearchStation'

function Loader() {
  return <div>Loading...</div>
}

export default function App() {
  const [station, setStation] = useState('')

  const { loading, searchStation } = useSearchStation()

  const onSearch = () => {
    searchStation(station)
  }

  return (
    <div className="cf">
      <label htmlFor="station" className="f6 b db mb2">
        <span className="normal black-60">Search for a station</span>
      </label>
      <input
        id="station"
        className="f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns"
        placeholder="Enter a station or a station name"
        type="text"
        value={station || ''}
        onChange={({ target: { value } }) => setStation(value)}
      />
      <button
        onClick={onSearch}
        className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns"
      >
        Search
      </button>
      <small className="f6 black-60 db mb2">
        You can search by the suburb or station name
      </small>
      {loading && Loader()}
    </div>
  )
}
