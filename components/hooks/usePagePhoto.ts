// hooks/usePagePhoto.ts
import { useState, useEffect } from 'react'

type Photo = {
  id: string
  url: string
  alt: string | null
}

export function usePagePhoto(page: string, fallback: string) {
  const [url, setUrl] = useState<string>(fallback)
  const [alt, setAlt] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(`/api/page-photos?page=${encodeURIComponent(page)}`)
      .then((r) => r.json())
      .then((photos: any[]) => {
        if (cancelled) return
        if (Array.isArray(photos) && photos.length > 0) {
          setUrl(photos[0].url)
          setAlt(photos[0].alt || '')
        } else {
          setUrl(fallback)
          setAlt(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUrl(fallback)
          setAlt(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [page, fallback])

  return { url, alt }
}