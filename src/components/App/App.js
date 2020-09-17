import React, { useState } from 'react'
import useStations from './hooks/useStations'
import useFeed from './hooks/useFeed'
import SearchBar from '../SearchBar/SearchBar'
import List from '../List/List'
import Status from '../Status/Status'
import AirQuality from '../App/components/AirQuality'
import Attributions from '../App/components/Attributions'
import 'tachyons'

export default function App() {
  const [station, setStation] = useState('')

  const {
    fetchStations,
    loading: fetchStationsLoading,
    stations,
    error: fetchStationsError,
  } = useStations()

  const {
    fetchFeed,
    resetFeed,
    loading: fetchFeedLoading,
    feed,
    error: fetchFeedError,
  } = useFeed()

  const hasStations = stations?.length > 0
  const hasFeed = Object.keys(feed || {}).length > 0

  const loading = fetchStationsLoading || fetchFeedLoading
  const errors = fetchStationsError || fetchFeedError

  return (
    <>
      <SearchBar
        onChange={({ target: { value } }) => setStation(value)}
        onSubmit={() => {
          resetFeed()
          fetchStations(station)
        }}
        value={station}
        title="Air Quality Index"
        label="Search for a station"
        placeholder="Enter a station name"
      />

      <Status loading={loading} errors={errors} />

      <List
        list={stations}
        onSelect={({ target }) => fetchFeed(target.getAttribute('data-value'))}
        show={hasStations && !hasFeed}
        label="Select a station"
      />

      <AirQuality feed={feed} show={hasFeed} />

      <Attributions attributions={feed?.attributions} show={hasFeed} />
    </>
  )
}
