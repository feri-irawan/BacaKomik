import useSWR from 'swr'
import ComicCard from '../components/ComicCard'
import { NoData } from '../components/Errors'
import Layouts from '../components/Layouts'

export default function Popular() {
  const fetcher = (url) => fetch(url).then((res) => res.json())

  const popular = useSWR('/api/comics/popular', fetcher)
  const popularComics = popular.data ? popular.data.data : null

  // Jika belum ada data
  if (popular.error) return <NoData error={true} />

  return (
    <Layouts title="Populer">
      <div className="mt-3">
        <h1 className="text-xl font-bold text-green-500 uppercase text-center my-3">
          Populer
        </h1>
        <p className="text-center mb-3">
          Berikut ini {popularComics ? popularComics.length : 0} komik populer.
        </p>
        {popularComics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 mx-auto">
            {popularComics.map((comic, i) => (
              <ComicCard key={i} comic={comic} />
            ))}
          </div>
        )}
      </div>
    </Layouts>
  )
}
