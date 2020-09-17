import React from 'react'

export default function Attributions({ show, attributions }) {
  return (
    show && (
      <dl className="lh-title pa4 mt0">
        <dt className="f3 b mt2">EPA Attributions</dt>
        <small className="f6 black-60 db mb2">
          Click the following to find out more
        </small>

        <ul className="list">
          {attributions?.map(({ url, name }) => (
            <li className="dib mr1 mb2" key={url}>
              <a
                href={url}
                className="f7 f5-ns b db pa2 link dim dark-gray ba b--black-20"
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
      </dl>
    )
  )
}
