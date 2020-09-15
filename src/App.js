import React from 'react'
import * as R from 'ramda'
import 'tachyons'

const App = ({
  feed,
  search,
  setFeed,
  setSearch,
  searchData,
  setSearchData,
}) => (
  <div className="flex flex-column">
    <header className="f2 pv3 ph4 bg-light-purple white flex-grow-0 flex-shrink-0">
      Air Quality Index
    </header>
    <div className="pa5 flex-grow-1 flex-shrink-0 flex items-start">
      <div>
        <form
          className="flex"
          onSubmit={(event) => {
            event.preventDefault()
            fetch(
              `http://api.waqi.info/search/?keyword=${search}&token=8d8e978e647d2b0a8c17c04ba331c0117cd06dc8`
            )
              .then(R.invoker(0, 'json'))
              .then(R.prop('data'))
              .then(setSearchData)
          }}
        >
          <div className="w5 flex items-center">
            <input
              type="text"
              value={search}
              placeholder="Melbourne"
              onChange={R.compose(
                setSearch,
                R.prop('value'),
                R.prop('target')
              )}
              className="br1 br--top br--left ba b--light-gray ph3 pv2 flex-grow-1 flex-shrink-1"
            />
            <button
              type="submit"
              className="br1 bl-0 br--top br--right b--light-gray white pa2 right-0 flex-grow-0 flex-shrink-0"
            >
              <span role="img" aria-label="search">
                🕵️
              </span>
            </button>
          </div>
        </form>
        <div className="br1 br--bottom flex flex-column w5 bb bl br b--light-gray border-box">
          {searchData ? (
            <div className="pv2">
              {searchData.map(({ station: { name } }) => (
                <button
                  className="pv2 ph3 flex-grow-0 flex-shrink-0 b-white ba-0 b--white tl w-100 border-box"
                  onClick={() =>
                    fetch(
                      `http://api.waqi.info/feed/${name}/?token=8d8e978e647d2b0a8c17c04ba331c0117cd06dc8`
                    )
                      .then(R.invoker(0, 'json'))
                      .then(R.prop('data'))
                      .then(setFeed)
                  }
                >
                  {name}
                </button>
              ))}
            </div>
          ) : (
            <div className="ph3 pv2 silver h4 flex items-center justify-center">
              Search for a city
            </div>
          )}
        </div>
      </div>
      {feed && (
        <div className="ba b--light-gray br1 ml5" style={{ width: 512 }}>
          <div className="pv2 ph3 flex justify-between">
            {feed.city.name}
            <div>
              ({feed.city.geo[0]}, {feed.city.geo[1]})
            </div>
          </div>
          <div className="h4 pv2 ph3 flex justify-center items-center f1">
            {feed.aqi}
          </div>
          <div className="f7 pv2">
            {feed.attributions.map(({ url, name }) => (
              <div className="flex justify-between pv1 ph3">
                <div>{name}</div>
                <div className="blue pl3">{url}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)

const withState = (name, setName, initialState) => (Component) => {
  const factory = React.createFactory(Component)
  class WithState extends React.Component {
    state = { [name]: initialState }

    set = (value) =>
      this.state[name] !== value
        ? (this.setState({ [name]: value }), true)
        : false

    render = () =>
      factory({ ...this.props, ...this.state, [setName]: this.set })
  }
  return WithState
}

export default R.compose(
  withState('feed', 'setFeed', null),
  withState('search', 'setSearch', ''),
  withState('searchData', 'setSearchData', null)
)(App)
