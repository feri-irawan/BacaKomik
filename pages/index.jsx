import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import ComicCard from '../components/ComicCard'
import { NoData } from '../components/Errors'
import Layouts from '../components/Layouts'

export default function Home() {
  const fetcher = (url) => fetch(url).then((res) => res.json())

  const newcomic = useSWR('/api/comics', fetcher)

  const newComics = newcomic.data ? newcomic.data.data : null

  const [displaySearch, setDisplaySearch] = useState(false)

  // Search
  const [searchComics, setSearchComics] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (searchComics !== null) setDisplaySearch(true)
    if (searchQuery.length === 0) setDisplaySearch(false)
  }, [searchComics, searchQuery])

  const searching = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    setSearchComics(null)

    if (searchQuery.length > 0)
      fetch(`/api/comics?s=${query}`)
        .then((res) => res.json())
        .then(({ data }) => {
          setSearchComics(data)
        })
  }

  // Jika belum ada data
  if (newcomic.error) return <NoData error={true} />

  return (
    <Layouts title="Home">
      <div className="grid md:grid-cols-2 gap-3 my-3">
        <div></div>
        <div>
          <input
            onChange={searching}
            type="search"
            placeholder="Cari komik..."
            className="px-3 py-2 ml-auto outline-none block border-green-500 border hover:ring ring-green-500/50 duration-300 rounded-lg w-full"
          />
        </div>
      </div>

      {/* Search */}
      {displaySearch && (
        <div className="mt-3">
          <h1 className="text-xl font-bold text-green-500 uppercase text-center my-3">
            Pencarian
          </h1>
          <p className="text-center mb-3">
            Berikuut ini hasil pencarian dari <strong>{searchQuery}</strong>
          </p>
          {searchComics && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 mx-auto">
              {searchComics.map((comic, i) => (
                <ComicCard key={i} comic={comic} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Baru */}

      <div className="mt-10">
        <h1 className="text-xl font-bold text-green-500 uppercase text-center my-3">
          Terbaru
        </h1>
        <p className="text-center mb-3">
          Berikut ini {newComics ? newComics.length : 0} komik terbaru.
        </p>
        {newComics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 mx-auto">
            {newComics.map((comic, i) => (
              <ComicCard key={i} comic={comic} />
            ))}
          </div>
        )}
      </div>
    </Layouts>
  )
}
