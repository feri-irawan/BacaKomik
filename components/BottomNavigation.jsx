import Link from 'next/link'

import {
  ClockIcon,
  FireIcon,
  HomeIcon,
  SearchCircleIcon
} from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const navs = [
  {
    title: 'Home',
    path: '/',
    icon: <HomeIcon className="w-6" />
  },
  {
    title: 'Populer',
    path: '/popular',
    icon: <FireIcon className="w-6" />
  },
  {
    title: 'Update',
    path: '/update',
    icon: <ClockIcon className="w-6" />
  },
  {
    title: 'Search',
    path: '/search',
    icon: <SearchCircleIcon className="w-6" />
  }
]

export default function BottomNavigation() {
  const router = useRouter()
  const [active, setActive] = useState(null)
  const firstPath = '/' + router.asPath.split('/')[1].split('?')[0]

  useEffect(() => {
    setActive(navs.find(({ path }) => path === firstPath).path)
  }, [])

  return (
    <div className="sticky inset-x-0 bottom-0 bg-green-500 text-white">
      <div className="grid grid-cols-4">
        {navs.map(({ title, path, icon }, i) => (
          <Link key={i} href={path}>
            <a
              className={`p-3 text-center inline-block text-sm ${
                active === path ? 'bg-green-600' : ''
              }`}
            >
              <div className="max-w-max mx-auto">{icon}</div>
              {title}
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}
