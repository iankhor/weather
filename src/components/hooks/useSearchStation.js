import React from 'react'
import axios from 'axios'

export function searchStationUrl(stationName) {
  return `http://api.waqi.info/search/?keyword=${stationName}&token=8d8e978e647d2b0a8c17c04ba331c0117cd06dc8`
}

export default function useSearchStation() {
  const search = async (stationName) => {
    try {
      const resp = await axios.get(searchStationUrl(stationName))
      // console.log(resp)
    } catch (e) {
      // console.log(stationName)
      // console.log(e)
    }
  }

  return { search }
}
