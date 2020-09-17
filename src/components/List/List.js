import React from 'react'

export default function List({ label, list, show, onSelect }) {
  return (
    show && (
      <>
        <label className="flex flex-column">
          <div className="center">{label}</div>
        </label>
        <ul
          className="list pl0 ml0 center mw5 ba b--light-silver br3"
          aria-label="Stations"
        >
          {list.map((station, index) => (
            <li
              key={index}
              className="ph3 pv2 bb b--light-silver"
              aria-label={station}
              data-value={station}
              onClick={onSelect}
            >
              {station}
            </li>
          ))}
        </ul>
      </>
    )
  )
}
