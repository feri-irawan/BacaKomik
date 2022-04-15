import { getPagesOfComic } from '../../../utils/scraper'

export default async function Read(req, res) {
  const { chapter } = req.query

  const pages = await getPagesOfComic(chapter)

  res.send(pages)
}
