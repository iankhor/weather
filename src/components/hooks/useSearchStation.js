import React from 'react'

export function searchStationUrl(search) {
  return `http://api.waqi.info/search/?keyword=${search}&token=8d8e978e647d2b0a8c17c04ba331c0117cd06dc8`
}

export default function useSearchStation() {}
