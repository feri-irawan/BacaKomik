import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import ComicCard from '../components/ComicCard'
import { NoData } from '../components/Errors'
import Layouts from '../components/Layouts'

export default function Home() {
  const fetcher = (url) => fetch(url).then((res) => res.json())

  const newcomic = useSWR('/api/comics', fetcher)
  const popular = useSWR('/api/comics/popular', fetcher)
  const update = useSWR('/api/comics/update', fetcher)

  const newComics = newcomic.data ? newcomic.data.data : null
  const popularComics = popular.data ? popular.data.data : null
  const updateComics = update.data ? update.data.data : null

  const [displayNew, setDisplayNew] = useState(false)
  const [displayPopular, setDisplayPopular] = useState(true)
  const [displayUpdate, setDisplayUpdate] = useState(false)
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
  if (popular.error) return <NoData error={true} />

  return (
    <Layouts title="Home">
      <div className="grid md:grid-cols-2 gap-3 my-3">
        <div>
          <button
            onClick={() => setDisplayNew(!displayNew)}
            className={`px-3 py-2 bg-green-500/20 inline-block m-1 rounded-lg border hover:bg-green-500/40 duration-300 ${
              !displayNew ? 'border-transparent' : 'border-green-500'
            }`}
          >
            Baru
          </button>
          <button
            onClick={() => setDisplayPopular(!displayPopular)}
            className={`px-3 py-2 bg-green-500/20 inline-block m-1 rounded-lg border hover:bg-green-500/40 duration-300 ${
              !displayPopular ? 'border-transparent' : 'border-green-500'
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setDisplayUpdate(!displayUpdate)}
            className={`px-3 py-2 bg-green-500/20 inline-block m-1 rounded-lg border hover:bg-green-500/40 duration-300 ${
              !displayUpdate ? 'border-transparent' : 'border-green-500'
            }`}
          >
            Diperbarui
          </button>
        </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 mx-auto">
              {searchComics.map((comic, i) => (
                <ComicCard key={i} comic={comic} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Popular */}
      {displayPopular && (
        <div className="mt-3">
          <h1 className="text-xl font-bold text-green-500 uppercase text-center my-3">
            Populer
          </h1>
          <p className="text-center mb-3">
            Berikut ini {popularComics ? popularComics.length : 0} komik
            populer.
          </p>
          {popularComics && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 mx-auto">
              {popularComics.map((comic, i) => (
                <ComicCard key={i} comic={comic} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Update */}
      {displayUpdate && (
        <div className="mt-10">
          <h1 className="text-xl font-bold text-green-500 uppercase text-center my-3">
            Update
          </h1>
          <p className="text-center mb-3">
            Berikut ini {updateComics ? updateComics.length : 0} komik yang
            terakhir diperbarui
          </p>
          {updateComics && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 mx-auto">
              {updateComics.map((comic, i) => (
                <ComicCard key={i} comic={comic} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Baru */}
      {displayNew && (
        <div className="mt-10">
          <h1 className="text-xl font-bold text-green-500 uppercase text-center my-3">
            Terbaru
          </h1>
          <p className="text-center mb-3">
            Berikut ini {newComics ? newComics.length : 0} komik terbaru.
          </p>
          {newComics && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 mx-auto">
              {newComics.map((comic, i) => (
                <ComicCard key={i} comic={comic} />
              ))}
            </div>
          )}
        </div>
      )}
    </Layouts>
  )
}
