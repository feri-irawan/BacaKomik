import Link from 'next/link'
import { useState } from 'react'

export default function ComicCard({ comic }) {
  const { type, title, thumb, details, chapters, rating } = comic

  const [src, setSrc] = useState(`/api/image?url=${thumb}`)

  let typeColor
  switch (type) {
    case 'Manhwa':
      typeColor = 'blue'
      break

    case 'Manhua':
      typeColor = 'sky'
      break

    default:
      typeColor = 'green'
      break
  }

  return (
    <article
      data-aos="fade-up"
      className="rounded-lg flex flex-col shadow-md overflow-hidden h-full hover:ring ring-green-500/50 duration-300"
    >
      <Link href={`/details${details}`}>
        <div className="relative flex cursor-pointer justify-center items-center bg-green-500/20">
          <img
            src={src}
            alt={title}
            className="w-full"
            style={{ minHeight: '150px' }}
            onError={() =>
              setSrc('https://dummyimage.com/600x400/86efad/22c55e')
            }
          />

          {/* Init typeColor */}
          <div className="bg-blue-500 hidden"></div>
          <div className="bg-sky-500 hidden"></div>

          <div
            className={`px-2 py-1 bg-${typeColor}-500 text-white text-sm sm:text-base absolute bottom-3 left-3 rounded-lg`}
          >
            {type}
          </div>
        </div>
      </Link>
      <div className="p-3">
        <h1
          className="text-md sm:text-lg font-bold text-green-500 hover:text-green-600"
          title="Klik untuk melihat detail komik."
        >
          <Link href={`/details${details}`}>
            <a>{title}</a>
          </Link>
        </h1>
      </div>
      <div className="text-sm sm:text-base p-3 mt-auto flex flex-wrap justify-around items-center bg-green-500/10">
        <div className="">Chapter: {chapters}</div>
        <div className="">Rating: {rating}</div>
      </div>
    </article>
  )
}
