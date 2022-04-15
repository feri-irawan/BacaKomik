import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layouts from '../../components/Layouts'
import { join } from 'path'
import ComicPage from '../../components/ComicPage'
import Link from 'next/link'
import Loading from '../../components/Loading'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/solid'

export default function Read() {
  const router = useRouter()
  const { chapter } = router.query

  const [data, setData] = useState(null)

  // Mendapatkan data
  useEffect(() => {
    if (chapter)
      fetch(join('/api/ch', chapter))
        .then((res) => res.json())
        .then((res) => setData(res))
  }, [chapter])

  // Jika belum ada data
  if (!data)
    return (
      <Layouts title="Memuat Komik...">
        <Loading message="Sedang memuat komik..." loading={true} />
      </Layouts>
    )

  // Jika sudah ada data
  const { title, paginations, pages } = data

  return (
    <Layouts title="">
      <div className="text-center">
        <h1 className="text-xl text-green-500 font-bold">{title}</h1>
      </div>

      <div className="my-3 overflow-hidden rounded-lg shadow-lg max-w-max mx-auto">
        {pages.map((page, i) => (
          <ComicPage page={{ i: i++, page }} />
        ))}
      </div>

      <div
        className={`sticky inset-x-0 bottom-0 bg-green-100 rounded-t-lg p-2 ${
          paginations.length > 1 ? 'grid grid-cols-2' : 'text-center'
        }`}
      >
        <div>
          <Link href={paginations[0].path}>
            <a className="inline-block px-3 py-2 bg-green-500/30 rounded-lg hover:ring ring-green-500/60 duration-300">
              <ChevronDoubleLeftIcon className="w-4 inline-block mr-1" />
              {paginations[0].title}
            </a>
          </Link>
        </div>
        {paginations.length > 1 && (
          <div className="text-right">
            <Link href={paginations[1].path}>
              <a className="inline-block px-3 py-2 bg-green-500/30 rounded-lg hover:ring ring-green-500/60 duration-300">
                {paginations[1].title}{' '}
                <ChevronDoubleRightIcon className="w-4 inline-block" />
              </a>
            </Link>
          </div>
        )}
      </div>
    </Layouts>
  )
}
