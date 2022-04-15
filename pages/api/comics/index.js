import { getLatestComics } from '../../../utils/scraper'

export default async function Comics(req, res) {
  const latest = (await getLatestComics()).slice(0, 10)

  res.status(200).json({
    code: 200,
    message: `Daftar ${latest.length} komik terbaru.`,
    data: latest
  })
}
