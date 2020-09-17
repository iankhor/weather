import React, { useState } from 'react'
import useSearchStation from './hooks/useSearchStation'
import useSearchWeather from './hooks/useSearchWeather'
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
                  placeholder="Enter a station name"
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
            className="mw5 center bg-white br3 pa mv3 ba b--black-10"
          >
            <div className="tc">
              <h1 className="f3 f1-m f-headline-l">{searchWeatherData.aqi}</h1>
              <h2 className="f5 fw4 gray mt0">{searchWeatherData.cityName}</h2>
              <hr className="mw3 bb bw1 b--black-10" />
            </div>

            <dl className="lh-title pa4 mt0">
              <dt className="f6 b">Coordinates</dt>
              <dd className="ml0">{`${searchWeatherData.geoLocation.lat}, ${searchWeatherData.geoLocation.lng}`}</dd>
            </dl>
          </article>

          <dl className="lh-title pa4 mt0">
            <dt className="f3 b mt2">EPA Attributions</dt>
            <small className="f6 black-60 db mb2">
              Click the following to find out more
            </small>

            <ul className="list">
              {searchWeatherData.attributions?.map(({ url, name }) => (
                <li className="dib mr1 mb2">
                  <a
                    href={url}
                    className="f7 f5-ns b db pa2 link dim dark-gray ba b--black-20"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </dl>
        </>
      )}
    </>
  )
}
