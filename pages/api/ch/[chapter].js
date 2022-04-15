import { baseURL } from '../../../constants/scraper'
import { getPagesOfComic } from '../../../utils/scraper'
import { join } from 'path'
import got from 'got'

export default async function Read(req, res) {
  const { chapter } = req.query

  const html = await got.get(join(baseURL, 'ch', chapter)).text()
  const pages = await getPagesOfComic(html)

  res.send(pages)
}
