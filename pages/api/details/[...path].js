import { getDetailsComic } from '../../../utils/scraper'
// import { join } from 'path'

export default async function Details(req, res) {
  const { path } = req.query

  const details = await getDetailsComic(path.join('/'))

  res.send(details)
}
