import { useState, useEffect } from 'react'
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

export function buildFeedUrl(name) {
  return encodeURI(
    `http://api.waqi.info/feed/${name}/?token=8d8e978e647d2b0a8c17c04ba331c0117cd06dc8`
  )
}

export default function useFeed() {
  const { fetch, data, error: fetchError, ...state } = useFetch()
  const [error, setError] = useState(null)
  const [feed, setFeed] = useState(null)

  const resetFeed = () => {
    setFeed(null)
    setError(null)
  }

  useEffect(() => {
    if (fetchError.length > 0) {
      setError(fetchError)
    }
  }, [fetchError])

  useEffect(() => {
    const isValidFeed = typeof data == 'object'

    if (isValidFeed) {
      setError(null)
      setFeed(serializeFeed(data))
    } else {
      setError('Unknown station. Unable to retrieve feed')
    }
  }, [data])

  const fetchFeed = (name) => {
    fetch(buildFeedUrl(name))
  }

  return { fetchFeed, resetFeed, feed, error, ...state }
}
