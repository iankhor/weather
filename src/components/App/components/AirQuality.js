import React from 'react'

export default function AirQuality({ show, feed }) {
  return (
    show && (
      <article
        aria-label="weather info"
        className="mw5 center bg-white br3 pa mv3 ba b--black-10"
      >
        <div className="tc">
          <h1 className="f3 f1-m f-headline-l">{feed.aqi}</h1>
          <h2 className="f5 fw4 gray mt0">{feed.cityName}</h2>
          <hr className="mw3 bb bw1 b--black-10" />
        </div>

        <dl className="lh-title pa4 mt0">
          <dt className="f6 b">Coordinates</dt>
          <dd className="ml0">{`${feed.geoLocation.lat}, ${feed.geoLocation.lng}`}</dd>
        </dl>
      </article>
    )
  )
}
