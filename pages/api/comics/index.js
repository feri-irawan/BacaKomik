import { getLatestComics } from '../../../utils/scraper'

export default async function Comics(req, res) {
  const latest = await getLatestComics(req.query.max_results)

  res.status(200).json({
    code: 200,
    message: `Daftar ${latest.length} komik terbaru.`,
    data: latest
  })
}
