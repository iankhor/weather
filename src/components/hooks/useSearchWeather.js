import { useReducer } from 'react'
import useFetch from './useFetch'

export function searchWeatherUrl(stationName) {
  return
}

function serializeFeed(feed) {
  const { city, aqi, attributions } = feed

  return {
    cityName: city.name,
    geoLocation: { lat: city.geo[0], lng: city.geo[1] },
    url: city.url,
    aqi: aqi,
    attributions,
  }
}

export default function useSearchStation() {
  const { fetch, data, ...state } = useFetch()

  const searchWeather = (name) =>
    fetch(
      `http://api.waqi.info/feed/${name}/?token=8d8e978e647d2b0a8c17c04ba331c0117cd06dc8`,
      serializeFeed
    )

  return { searchWeather, feed: data, ...state }
}
