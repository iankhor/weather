import React from 'react'

export default function SearchBar({
  title,
  label,
  placeholder,
  onChange,
  onSubmit,
  value,
}) {
  return (
    <div className="flex flex-column">
      <div className="pa4-l">
        <div className="bg-light-red mw7 center pa4 br2-ns ba b--black-10">
          <fieldset className="cf bn ma0 pa0">
            <legend className="pa0 f5 f4-ns mb3 black-80">{title}</legend>
            <div className="cf">
              <label htmlFor="search" className="clip">
                {label}
              </label>

              <input
                className="f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns"
                id="search"
                placeholder={placeholder}
                type="text"
                value={value || ''}
                onChange={onChange}
              />
              <input
                className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns"
                type="submit"
                value="Search"
                onClick={onSubmit}
              />
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  )
}
