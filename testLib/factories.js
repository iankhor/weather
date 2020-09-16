export function buildCityWeatherData(mockData) {
  return {
    cityName: 'Melbourne',
    geoLocation: {
      lat: '1',
      lng: '2',
    },
    aqi: '123',
    url: 'www.url',
    ...mockData,
  }
}
