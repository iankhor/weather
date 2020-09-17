import useFetch from './useFetch'

export function searchStationUrl(stationName) {
  return `http://api.waqi.info/search/?keyword=${stationName}&token=8d8e978e647d2b0a8c17c04ba331c0117cd06dc8`
}

function serializeStationList(stations) {
  return stations && stations.map(({ station: { name } }) => name)
}

export default function useSearchStation() {
  const { fetch, data, ...state } = useFetch()

  const searchStation = (name) =>
    fetch(
      encodeURI(
        `http://api.waqi.info/search/?keyword=${name}&token=8d8e978e647d2b0a8c17c04ba331c0117cd06dc8`
      )
    )

  return { searchStation, stations: serializeStationList(data), ...state }
}
