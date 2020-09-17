import React, { useState } from 'react'
import useSearchStation from '../hooks/useSearchStation'
import useSearchWeather from '../hooks/useSearchWeather'
import 'tachyons'

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
      <div className="flex flex-column">
        <div className="pa4-l">
          <div className="bg-light-red mw7 center pa4 br2-ns ba b--black-10">
            <fieldset className="cf bn ma0 pa0">
              <legend className="pa0 f5 f4-ns mb3 black-80">
                Air Quality Index
              </legend>
              <div className="cf">
                <label htmlFor="station" className="clip">
                  Search for a station
                </label>

                <input
                  className="f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns"
                  id="station"
                  placeholder="Enter a station or a station name"
                  type="text"
                  value={station || ''}
                  onChange={({ target: { value } }) => setStation(value)}
                />
                <input
                  className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns"
                  type="submit"
                  value="Search"
                  onClick={searchForStation}
                />
              </div>
            </fieldset>
          </div>
        </div>
      </div>
      <div className="flex flex-column">
        <div className="center">
          {(searchStationLoading || searchWeatherLoading) && <Loader />}
          {searchStationError.length > 0 && <div>{searchStationError}</div>}
          {searchWeatherError.length > 0 && <div>{searchWeatherError}</div>}
        </div>
      </div>
      {searchStationData?.length > 0 &&
        Object.keys(searchWeatherData || {}).length === 0 && (
          <>
            <div className="flex flex-column">
              <div className="center">Select a station</div>
            </div>
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
          </>
        )}
      {Object.keys(searchWeatherData || {}).length > 0 && (
        <>
          <article
            aria-label="weather info"
            className="mw5 center bg-white br3 pa pa4-ns mv3 ba b--black-10"
          >
            <div className="tc">
              <h2 className="f5 f4-m f3-l fw2 black-50 mt0 lh-copy">
                {searchWeatherData.cityName}
              </h2>
              <h1 className="f1">{searchWeatherData.aqi}</h1>
              <hr className="mw3 bb bw1 b--black-10" />
            </div>

            <dl className="lh-title pa4 mt0">
              <dt className="f6 b">Coordinates</dt>
              <dd className="ml0">{`Lat: ${searchWeatherData.geoLocation.lat}  Lat: ${searchWeatherData.geoLocation.lng}`}</dd>
              <dt className="f6 b mt2">EPA Attributions</dt>
              <dd className="ml0">{searchWeatherData.url}</dd>
            </dl>
          </article>
        </>
      )}
    </>
  )
}
