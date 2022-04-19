import useSWR from 'swr'
import ComicCard from '../components/ComicCard'
import { NoData } from '../components/Errors'
import Layouts from '../components/Layouts'

export default function Update() {
  const fetcher = (url) => fetch(url).then((res) => res.json())

  const update = useSWR('/api/comics/update', fetcher)
  const updateComics = update.data ? update.data.data : null

  // Jika belum ada data
  if (update.error) return <NoData error={true} />

  return (
    <Layouts title="Update">
      <div className="mt-10">
        <h1 className="text-xl font-bold text-green-500 uppercase text-center my-3">
          Update
        </h1>
        <p className="text-center mb-3">
          Berikut ini {updateComics ? updateComics.length : 0} komik yang
          terakhir diperbarui
        </p>
        {updateComics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 mx-auto">
            {updateComics.map((comic, i) => (
              <ComicCard key={i} comic={comic} />
            ))}
          </div>
        )}
      </div>
    </Layouts>
  )
}
