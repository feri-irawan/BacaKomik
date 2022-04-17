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
    thumb,
    description,
    genres,
    status,
    released,
    author,
    type,
    serialization,
    postedBy,
    postedOn,
    updatedOn,
    rating,
    chapters
  } = data

  return (
    <Layouts title={title}>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <div className="relative overflow-hidden rounded-lg flex justify-center items-center mt-3">
            <img
              src={`/api/image?url=${thumb}`}
              alt={title}
              className="w-full"
            />
            <div className="absolute inset-x-0 bottom-0 bg-green-500 text-white p-3">
              <h1 className="text-xl font-bold">{title}</h1>
            </div>
          </div>
        </div>
        <div>
          <table className="w-full sticky top-3">
            <tr>
              <td>Jenis Komik</td>
              <td>{type}</td>
            </tr>
            <tr>
              <td>Rilis</td>
              <td>{released}</td>
            </tr>
            <tr>
              <td>Serial</td>
              <td>{serialization}</td>
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
              <td>Rating</td>
              <td>{rating}</td>
            </tr>
            <tr>
              <td>Diposting oleh</td>
              <td>{postedBy}</td>
            </tr>
            <tr>
              <td>Diposting pada</td>
              <td>{postedOn}</td>
            </tr>
            <tr>
              <td>Diperbarui pada</td>
              <td>{updatedOn}</td>
            </tr>
          </table>
        </div>
      </div>

      <h2 className="text-xl font-bold text-green-500">Genre</h2>
      <p className="mb-3">
        {genres.map((g, i) => (
          <a className="px-2 py-0 bg-green-500/10 text-green-500 rounded-md inline-block m-0.5 border border-transparent hover:border-green-500 duration-300">
            {g}
          </a>
        ))}
      </p>

      <h2 className="text-xl font-bold text-green-500">Deskripsi</h2>
      <p className="bg-green-500/30 p-3 rounded-lg my-3">{description}</p>

      <h2 className="text-xl font-bold text-green-500">Chapters</h2>
      <table className="w-full">
        {chapters.map((chapter, i) => (
          <tr>
            <td>
              <Link href={chapter.path}>
                <a className="hover:text-green-500 duration-300 block font-bold">
                  Chapter: {chapter.title.replace('Chapter ', '')}
                </a>
              </Link>
            </td>
            <td className="text-right">
              <Link href={chapter.path}>
                <a className="bg-green-500 text-white duration-300 inline-block font-bold rounded-lg px-3 py-2">
                  Baca
                </a>
              </Link>
            </td>
          </tr>
        ))}
      </table>
    </Layouts>
  )
}
