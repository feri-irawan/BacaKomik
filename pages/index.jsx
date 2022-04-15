import { useState } from 'react'
import useSWR from 'swr'
import ComicCard from '../components/ComicCard'
import { NoData } from '../components/Errors'
import Layouts from '../components/Layouts'

export default function Home() {
  const fetcher = (url) => fetch(url).then((res) => res.json())

  const pustaka = useSWR('/api/comics', fetcher)
  const popular = useSWR('/api/comics/popular', fetcher)
  const popularToday = useSWR('/api/comics/popular?today=true', fetcher)

  const pustakaComics = pustaka.data ? pustaka.data.data : null
  const popularComics = popular.data ? popular.data.data : null
  const popularTodayComics = popularToday.data ? popularToday.data.data : null

  const [displayPustaka, setDisplayPustaka] = useState(false)
  const [displayPopular, setDisplayPopular] = useState(true)
  const [displayPopularToday, setDisplayPopularToday] = useState(false)

  // Jika belum ada data
  if (popular.error) return <NoData error={true} />

  return (
    <Layouts title="Home">
      <div className="my-3">
        <button
          onClick={() => setDisplayPustaka(!displayPustaka)}
          className={`px-3 py-2 bg-green-500/20 inline-block m-1 rounded-lg border hover:bg-green-500/40 duration-300 ${
            !displayPustaka ? 'border-transparent' : 'border-green-500'
          }`}
        >
          Pustaka
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
          onClick={() => setDisplayPopularToday(!displayPopularToday)}
          className={`px-3 py-2 bg-green-500/20 inline-block m-1 rounded-lg border hover:bg-green-500/40 duration-300 ${
            !displayPopularToday ? 'border-transparent' : 'border-green-500'
          }`}
        >
          Popular Today
        </button>
      </div>

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mx-auto">
              {popularComics.map((comic, i) => (
                <ComicCard key={i} comic={comic} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Popular Today */}
      {displayPopularToday && (
        <div className="mt-10">
          <h1 className="text-xl font-bold text-green-500 uppercase text-center my-3">
            Populer Hari Ini
          </h1>
          <p className="text-center mb-3">
            Berikut ini {popularTodayComics ? popularTodayComics.length : 0}{' '}
            komik populer hari ini.
          </p>
          {popularTodayComics && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mx-auto">
              {popularTodayComics.map((comic, i) => (
                <ComicCard key={i} comic={comic} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pustaka */}
      {displayPustaka && (
        <div className="mt-10">
          <h1 className="text-xl font-bold text-green-500 uppercase text-center my-3">
            Terbaru
          </h1>
          <p className="text-center mb-3">
            Berikut ini {pustakaComics ? pustakaComics.length : 0} komik
            terbaru.
          </p>
          {pustakaComics && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mx-auto">
              {pustakaComics.map((comic, i) => (
                <ComicCard key={i} comic={comic} />
              ))}
            </div>
          )}
        </div>
      )}
    </Layouts>
  )
}
