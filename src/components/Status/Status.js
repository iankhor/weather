import React from 'react'
import Loader from '../Loader/Loader'

export default function Status({ loading, errors }) {
  return (
    <div className="flex flex-column">
      <div className="center">
        {loading && <Loader />}
        {errors?.length > 0 && <div>{errors}</div>}
      </div>
    </div>
  )
}
