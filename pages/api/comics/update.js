import { getComics } from '../../../utils/scraper'

export default async function Comics(req, res) {
  const { max_results } = req.query

  const update = await getComics({ order: 'update' }, max_results)

  res.status(200).json({
    code: 200,
    message: `Daftar ${update.length} komik yang terakhir diperbarui.`,
    data: update
  })
}
