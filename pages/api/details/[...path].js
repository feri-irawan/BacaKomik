import { getDetailsComic } from '../../../utils/scraper'

export default async function Details(req, res) {
  const { path } = req.query
  const details = await getDetailsComic(path.join('/'))

  res.send({
    code: 200,
    message: `Detail komik ${details.title}`,
    ...details
  })
}
