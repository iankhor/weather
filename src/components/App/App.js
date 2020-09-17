import React, { useState } from 'react'
import useSearchStation from '../hooks/useSearchStation'
import useSearchWeather from '../hooks/useSearchWeather'

function Loader() {
  return (
    <div role="status" aria-label="progress">
      Loading...
    </div>
  )
}

export default function App() {
  const [station, setStation] = useState('')

  const {
    loading: searchStationLoading,
    searchStation,
    stations: searchStationData,
    error: searchStationError,
  } = useSearchStation()

  const {
    loading: searchWeatherLoading,
    feed: searchWeatherData,
    error: searchWeatherError,
    searchWeather,
  } = useSearchWeather()

  const searchForStation = () => {
    searchStation(station)
  }

  const searchWeatherForStation = (e) => {
    const station = e.target.getAttribute('data-value')
    searchWeather(station)
  }

  return (
    <>
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
          onClick={searchForStation}
          className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns"
        >
          Search
        </button>
        <small className="f6 black-60 db mb2">
          You can search by the suburb or station name
        </small>
      </div>
      {(searchStationLoading || searchWeatherLoading) && <Loader />}
      {searchStationData?.length > 0 &&
        Object.keys(searchWeatherData || {}).length === 0 && (
          <ul
            className="list pl0 ml0 center mw5 ba b--light-silver br3"
            aria-label="Stations"
          >
            {searchStationData.map((station, index) => (
              <li
                key={index}
                className="ph3 pv2 bb b--light-silver"
                aria-label={station}
                data-value={station}
                onClick={searchWeatherForStation}
              >
                {station}
              </li>
            ))}
          </ul>
        )}
      {searchStationError.length > 0 && <div>{searchStationError}</div>}
      {searchWeatherError.length > 0 && <div>{searchWeatherError}</div>}
      {Object.keys(searchWeatherData || {}).length > 0 && (
        <dl role="none" className="lh-title pa4 mt0" aria-label="weather info">
          <dt className="f6 b">{searchWeatherData.cityName}</dt>
          <dt className="f6 b">{searchWeatherData.geoLocation.lat}</dt>
          <dt className="f6 b">{searchWeatherData.geoLocation.lng}</dt>
          <dt className="f6 b">{searchWeatherData.aqi}</dt>
          <dt className="f6 b">{searchWeatherData.url}</dt>
        </dl>
      )}
    </>
  )
}
