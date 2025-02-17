import useFetch from './useFetch'

function serializeStationList(stations) {
  return stations && stations.map(({ station: { name } }) => name)
}

export function buildSearchUrl(name) {
  return encodeURI(
    `http://api.waqi.info/search/?keyword=${name}&token=8d8e978e647d2b0a8c17c04ba331c0117cd06dc8`
  )
}

export default function useStations() {
  const { fetch, data, ...state } = useFetch()

  const fetchStations = (name) => fetch(buildSearchUrl(name))

  return { fetchStations, stations: serializeStationList(data), ...state }
}
