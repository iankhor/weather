import React, { useState } from 'react'
import axios from 'axios'

export function searchStationUrl(stationName) {
  return `http://api.waqi.info/search/?keyword=${stationName}&token=8d8e978e647d2b0a8c17c04ba331c0117cd06dc8`
}

export default function useSearchStation() {
  const [stations, setStations] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const searchStation = async (stationName) => {
    setLoading(true)
    const res = await axios.get(searchStationUrl(stationName))
    const stationNames = res.data.map(({ station: { name } }) => name)
    setStations(stationNames)
    setSuccess(true)
    setLoading(false)

    // console.log(stationNames)
    // try {
    // } catch (e) {
    //   // console.log(stationName)
    //   // console.log(e)
    // }
  }

  return { searchStation, stations, success, loading, error: '' }
}
