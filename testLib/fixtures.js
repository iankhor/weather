export const stationsData = [
  {
    uid: 3758,
    aqi: '74',
    time: {
      tz: '+05:30',
      stime: '2020-09-16 13:00:00',
      vtime: 1600241400,
    },
    station: {
      name: 'Bangalore',
      geo: [13.0339, 77.51321111],
      url: 'india/bangalore/peenya',
      country: 'IN',
    },
  },
]

export const stationFeed = {
  idx: 7397,
  aqi: 71,
  time: {
    v: 1481396400,
    s: '2016-12-10 19:00:00',
    tz: '-06:00',
  },
  city: {
    name: 'Bangalore',
    url: 'https://aqicn.org/city/usa/illinois/chi_sp/',
    geo: ['41.913600', '-87.723900'],
  },
  iaqi: {
    pm25: {
      v: 71,
    },
  },
  forecast: {
    daily: {
      pm25: [
        {
          avg: 154,
          day: '2020-06-13',
          max: 157,
          min: 131,
        },
        {
          avg: 163,
          day: '2020-06-14',
          max: 173,
          min: 137,
        },
      ],
    },
  },
}
