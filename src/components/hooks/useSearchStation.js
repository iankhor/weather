import React, { useState, useReducer } from 'react'
import axios from 'axios'

export function searchStationUrl(stationName) {
  return `http://api.waqi.info/search/?keyword=${stationName}&token=8d8e978e647d2b0a8c17c04ba331c0117cd06dc8`
}

const initState = {
  success: null,
  loading: false,
  error: '',
  stations: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true }
    case 'success':
      return {
        ...state,
        stations: action.stations,
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

export default function useSearchStation() {
  const [state, dispatch] = useReducer(reducer, initState)

  const searchStation = async (stationName) => {
    dispatch({ type: 'loading' })

    try {
      const res = await axios.get(searchStationUrl(stationName))
      const stationNames = res.data.map(({ station: { name } }) => name)
      dispatch({ type: 'success', stations: stationNames })
    } catch (e) {
      dispatch({ type: 'error' })
    }
  }

  return { searchStation, ...state }
}
