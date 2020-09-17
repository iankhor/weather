import React, { useReducer } from 'react'
import axios from 'axios'

export function searchWeatherUrl(stationName) {
  return `http://api.waqi.info/feed/${stationName}/?token=8d8e978e647d2b0a8c17c04ba331c0117cd06dc8`
}

const initState = {
  success: null,
  loading: false,
  error: '',
  feed: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true }
    case 'success':
      return {
        ...state,
        feed: action.feed,
        loading: false,
        success: true,
      }
    case 'error':
      return {
        ...state,
        error: 'Something went wrong. Please try again',
        loading: false,
        success: false,
      }
  }
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
  const [state, dispatch] = useReducer(reducer, initState)

  const searchWeather = async (stationName) => {
    dispatch({ type: 'loading' })

    try {
      const res = await axios.get(searchWeatherUrl(stationName))
      const feed = serializeFeed(res.data.data)

      dispatch({ type: 'success', feed })
    } catch (e) {
      dispatch({ type: 'error' })
    }
  }

  return { searchWeather, ...state }
}
