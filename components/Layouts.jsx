import Head from 'next/head'
import Contents from './Contents'
import Footer from './Footer'
import Header from './Header'

export default function Layouts({ children, title }) {
  const appName = 'BacaKomik'
  return (
    <div className="text-slate-800">
      <Head>
        <title>{title ? `${appName} - ${title}` : appName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Contents body={children} />
      <Footer />
    </div>
  )
}
