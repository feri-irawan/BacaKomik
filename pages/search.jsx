import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import ComicCard from '../components/ComicCard'
import { NoData } from '../components/Errors'
import Layouts from '../components/Layouts'
import Loading from '../components/Loading'
import { genres, orderby, status, types } from '../constants/formSearch'

export default function Search() {
  const [searchComics, setSearchComics] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const query = new URLSearchParams(searchQuery)
    const url = `/api/comics?multiple_search=true&${query}`

    setLoading(true)
    fetch(url)
      .then((res) => res.json())
      .then(({ data }) => {
        setSearchComics(null)
        setSearchComics(data)
        setLoading(false)
      })
      .catch(() => setSearchQuery({}))
  }, [searchQuery])

  const searching = (e) => {
    e.preventDefault()
    const inputs = e.target
    const values = {}
    // values['genre'] = []

    Object.values(inputs)
      .filter((v) => v.checked === true || ['text', 'number'].includes(v.type))
      .map((v) => {
        values[v.name] = v.value

        // if (v.name !== 'genre') {
        //   values[v.name] = v.value
        // } else {
        //   values['genre'].push(v.value)
        // }
      })

    setSearchQuery(values)
  }

  return (
    <Layouts title="Search">
      <div className="mt-3">
        <h1 className="text-xl font-bold text-green-500 uppercase text-center my-3">
          Pencarian
        </h1>

        <form onSubmit={searching}>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
              <div className="mb-3 w-full col-span-2">
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Judul..."
                  className="px-3 py-2 focus:ring ring-green-500/50 border hover:border-green-500 outline-none rounded-lg block w-full duration-200"
                />
              </div>
              <div className="mb-3 w-full">
                <input
                  type="text"
                  id="author"
                  name="author"
                  placeholder="Penulis..."
                  className="px-3 py-2 focus:ring ring-green-500/50 border hover:border-green-500 outline-none rounded-lg block w-full duration-200"
                />
              </div>
              <div className="mb-3 w-full">
                <input
                  type="number"
                  id="year"
                  name="year"
                  placeholder="Tahun..."
                  className="px-3 py-2 focus:ring ring-green-500/50 border hover:border-green-500 outline-none rounded-lg block w-full duration-200"
                />
              </div>

              <div className="mb-3 w-full">
                <div className="font-bold">Status:</div>
                <div className="flex flex-wrap">
                  {status.map((v, i) => (
                    <label
                      key={i}
                      className="cursor-pointer inline-block mx-2 hover:text-green-500"
                    >
                      <input
                        type="radio"
                        name="status"
                        defaultChecked={i === 0 ? true : false}
                        value={v === 'All' ? '' : v.toLowerCase()}
                      />{' '}
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-3 w-full">
                <div className="font-bold">Urut berdasarkan:</div>
                <div className="flex flex-wrap">
                  {orderby.map((v, i) => (
                    <label
                      key={i}
                      className="cursor-pointer inline-block mx-2 hover:text-green-500"
                    >
                      <input
                        type="radio"
                        name="order"
                        defaultChecked={i === 0 ? true : false}
                        value={v.value}
                      />{' '}
                      {v.title}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-3 w-full col-span-2">
                <div className="font-bold">Tipe:</div>
                <div className="flex flex-wrap">
                  {types.map((v, i) => (
                    <label
                      key={i}
                      className="cursor-pointer inline-block mx-2 hover:text-green-500"
                    >
                      <input
                        type="radio"
                        name="type"
                        defaultChecked={i === 0 ? true : false}
                        value={v === 'All' ? '' : v.toLowerCase()}
                      />{' '}
                      {v}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="">
              <div className="font-bold">Genre:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4">
                {genres.map((v, i) => (
                  <label
                    key={i}
                    className="cursor-pointer mx-2 flex items-center hover:text-green-500"
                  >
                    <input
                      type="radio"
                      name="genre"
                      defaultChecked={i === 0 ? true : false}
                      value={v.toLowerCase().split(' ').join('-')}
                    />{' '}
                    <div className="ml-2">{v}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500/50 rounded-lg hover:ring ring-green-500/30 duration-300"
            >
              Simpan
            </button>
          </div>
        </form>

        <hr className="mt-3" />

        <Loading message="Mencari komik..." loading={loading} />

        {searchComics && (
          <div className="mb-3">
            <p className="text-center mb-3">Berikut ini hasil yang ditemukan</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 mx-auto">
              {searchComics.map((comic, i) => (
                <ComicCard key={i} comic={comic} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layouts>
  )
}
