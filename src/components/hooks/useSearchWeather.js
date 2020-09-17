import useFetch from './useFetch'

function serializeFeed(feed) {
  return (
    feed && {
      cityName: feed.city.name,
      geoLocation: { lat: feed.city.geo[0], lng: feed.city.geo[1] },
      url: feed.city.url,
      aqi: feed.aqi,
      attributions: feed.attributions,
    }
  )
}

export default function useSearchWeather() {
  const { fetch, data, ...state } = useFetch()

  const searchWeather = (name) =>
    fetch(
      encodeURI(
        `http://api.waqi.info/feed/${name}/?token=8d8e978e647d2b0a8c17c04ba331c0117cd06dc8`
      )
    )

  return { searchWeather, feed: serializeFeed(data), ...state }
}
