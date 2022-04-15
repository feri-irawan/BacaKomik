import { baseURL } from '../../../constants/scraper'
import { getDetailsComic } from '../../../utils/scraper'
import { join } from 'path'
import got from 'got'

export default async function Details(req, res) {
  const { path } = req.query

  const html = await got.get(join(baseURL, path.join('/'))).text()
  const details = await getDetailsComic(html)

  res.send(details)
}
