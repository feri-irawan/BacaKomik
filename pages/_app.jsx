import Aos from 'aos'
import { useEffect } from 'react'

import 'aos/dist/aos.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    Aos.init()
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
