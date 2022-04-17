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
    if (chapter) {
      setData(null)
      fetch(join('/api/read', chapter))
        .then((res) => res.json())
        .then((res) => setData(res))
    }
  }, [chapter])

  // Jika belum ada data
  if (!data)
    return (
      <Layouts title="Memuat Komik...">
        <Loading message="Sedang memuat komik..." loading={true} />
      </Layouts>
    )

  // Jika sudah ada data
  const { title, pagination, pages } = data

  return (
    <Layouts title="">
      <div className="text-center">
        <h1 className="text-xl text-green-500 font-bold">{title}</h1>
      </div>

      <div className="my-3 overflow-hidden rounded-lg shadow-lg w-full md:max-w-3xl mx-auto">
        {pages.map((page, i) => (
          <ComicPage page={{ i: i++, page }} />
        ))}
      </div>

      <div className="sticky inset-x-0 bottom-0 bg-green-100 rounded-t-lg p-2 grid grid-cols-2">
        <div>
          {pagination.prev && (
            <Link href={pagination.prev}>
              <a className="inline-block px-3 py-2 bg-green-500/30 rounded-lg hover:ring ring-green-500/60 duration-300">
                <ChevronDoubleLeftIcon className="w-4 inline-block mr-1" />{' '}
                Sebelumnya
              </a>
            </Link>
          )}
        </div>

        <div className="text-right">
          {pagination.next && (
            <Link href={pagination.next}>
              <a className="inline-block px-3 py-2 bg-green-500/30 rounded-lg hover:ring ring-green-500/60 duration-300">
                Selanjutnya{' '}
                <ChevronDoubleRightIcon className="w-4 inline-block" />
              </a>
            </Link>
          )}
        </div>
      </div>
    </Layouts>
  )
}
