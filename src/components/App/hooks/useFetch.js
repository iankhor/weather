import { useReducer } from 'react'
import axios from 'axios'

const initState = {
  success: null,
  loading: false,
  error: '',
  data: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true }
    case 'success':
      return {
        ...state,
        data: action.data,
        loading: false,
        success: true,
      }
    case 'error':
      return {
        ...state,
        error: 'Something went wrong. Please try again',
        loading: false,
        success: false,
      }

    default:
      return state
  }
}

export default function useFetch() {
  const [state, dispatch] = useReducer(reducer, initState)

  const fetch = async (url) => {
    dispatch({ type: 'loading' })

    try {
      const res = await axios.get(url)
      dispatch({ type: 'success', data: res.data.data })
    } catch (e) {
      dispatch({ type: 'error' })
    }
  }

  return { fetch, ...state }
}
