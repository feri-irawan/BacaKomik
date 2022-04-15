import { useRouter } from 'next/router'
import Link from 'next/link'
import Layouts from '../../components/Layouts'
import { join } from 'path'
import { useEffect, useState } from 'react'
import { NoData } from '../../components/Errors'

export default function Details() {
  const router = useRouter()
  const { path } = router.query

  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  // Mendapatkan data
  useEffect(() => {
    if (path)
      fetch(join('/api/details', path.join('/')))
        .then((res) => res.json())
        .then((res) => setData(res))
        .catch(() => setError(true))
  }, [path])

  // Jika belum ada data
  if (!data) return <NoData error={error} />

  // Jika sudah ada data
  const {
    title,
    description,
    thumb,
    type,
    genre,
    concept,
    author,
    status,
    readerAge,
    views,
    howToRead,
    sinopsis,
    chapters
  } = data

  return (
    <Layouts title={title.en}>
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <div className="relative overflow-hidden rounded-lg flex justify-center items-center">
          <img
            src={`/api/image?url=${thumb}`}
            alt={title.en}
            className="w-full"
          />
          <div className="absolute inset-x-0 bottom-0 bg-green-500 text-white p-3">
            <h1 className="text-xl font-bold">{title.en}</h1>
          </div>
        </div>

        <table className="w-full">
          <tr>
            <td>Judul Indonesia</td>
            <td>{title.id}</td>
          </tr>
          <tr>
            <td>Jenis Komik</td>
            <td>{type}</td>
          </tr>

          <tr>
            <td>Konsep Cerita</td>
            <td>{concept}</td>
          </tr>
          <tr>
            <td>Penulis</td>
            <td>{author}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{status}</td>
          </tr>
          <tr>
            <td>Umur pembaca</td>
            <td>{readerAge}</td>
          </tr>
          <tr>
            <td>Jumlah Pembaca</td>
            <td>{views}</td>
          </tr>
          <tr>
            <td>Cara Membaca</td>
            <td>{howToRead}</td>
          </tr>
          <tr>
            <td>Genre</td>
            <td>
              {genre.map((g, i) => (
                <a className="px-2 py-0 bg-green-500/10 text-green-500 rounded-md inline-block m-0.5 border border-transparent hover:border-green-500 duration-300">
                  {g}
                </a>
              ))}
            </td>
          </tr>
        </table>
      </div>
      <p className="bg-green-500/30 p-3 rounded-lg my-3">{description}</p>

      <h2 className="text-xl font-bold text-green-500">Chapters</h2>
      <table className="w-full">
        {chapters.map((chapter, i) => (
          <tr>
            <td>
              <Link href={chapter.path}>
                <a className="hover:text-green-500 duration-300 block font-bold">
                  Chapter: {chapter.chapter}
                </a>
              </Link>
            </td>
            <td className="text-right">{chapter.updated}</td>
          </tr>
        ))}
      </table>
    </Layouts>
  )
}
