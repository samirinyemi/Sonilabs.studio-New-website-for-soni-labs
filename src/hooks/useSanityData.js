import { useState, useEffect } from 'react'
import { sanityClient } from '../lib/sanity'

export function useSanityData(query, fallbackData = []) {
  const [data, setData] = useState(fallbackData)
  const [loading, setLoading] = useState(!!sanityClient)

  useEffect(() => {
    if (!sanityClient) return

    let cancelled = false

    sanityClient
      .fetch(query)
      .then((result) => {
        if (!cancelled && result?.length) {
          setData(result)
        }
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [query])

  return { data, loading }
}
