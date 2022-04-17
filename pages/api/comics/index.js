import { getComics } from '../../../utils/scraper'

export default async function Comics(req, res) {
  const { s, max_results } = req.query

  if (s) {
    // Search
    const results = await getComics({ s }, max_results)
    res.status(200).json({
      code: 200,
      message: `${results.length} komik hasil pencarian dari '${s}'`,
      data: results
    })
  } else {
    // Latest
    const latest = await getComics({ order: 'latest' }, max_results)
    res.status(200).json({
      code: 200,
      message: `Daftar ${latest.length} komik yang terakhir ditambahkan.`,
      data: latest
    })
  }
}
