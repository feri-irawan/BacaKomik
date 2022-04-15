import Link from 'next/link'
import { useState } from 'react'

export default function ComicCard({ comic }) {
  const { title, description, type, thumb, detail, chapters, views, updated } =
    comic

  const [src, setSrc] = useState(`/api/image?url=${thumb}`)

  return (
    <article
      data-aos="fade-up"
      className="rounded-lg flex flex-col shadow-md overflow-hidden h-full hover:ring ring-green-500/50 duration-300"
    >
      <Link href={`/details${detail}`}>
        <div className="flex cursor-pointer justify-center items-center bg-green-500/20">
          <img
            src={src}
            alt={title}
            className="w-full"
            style={{ minHeight: '150px' }}
            onError={() =>
              setSrc('https://dummyimage.com/600x400/86efad/22c55e')
            }
          />
        </div>
      </Link>
      <div className="p-3">
        <h1
          className="text-md sm:text-lg font-bold text-green-500 mb-3 hover:text-green-600"
          title="Klik untuk melihat detail komik."
        >
          <Link href={`/details${detail}`}>
            <a>{title}</a>
          </Link>
        </h1>
        <p className="text-slate-800/80 text-sm sm:text-base">
          {type} - {updated}
        </p>
        <p className="mt-3 mb-2 text-sm sm:text-base">{description}</p>
      </div>
      <div className="text-sm sm:text-base p-3 mt-auto flex flex-wrap justify-around items-center bg-green-500/10">
        <div className="">Chapter: {chapters}</div>
        <div className="">Dilihat: {views}</div>
      </div>
    </article>
  )
}
