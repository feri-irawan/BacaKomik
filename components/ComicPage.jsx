import { useState } from 'react'

export default function ComicPage({ page }) {
  const [src, setSrc] = useState(page.page)
  return (
    <img
      src={src}
      alt={`Page ${page.i + 1}`}
      className="w-full md:max-w-3xl mx-auto"
      style={{ minHeight: '300px' }}
      loading="lazy"
      onError={() => setSrc('https://dummyimage.com/400x500/86efad/22c55e')}
    />
  )
}
