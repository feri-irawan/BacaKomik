import { getComics } from '../../../utils/scraper'

export default async function Comics(req, res) {
  const {
    s,
    title,
    author,
    year,
    status,
    order,
    type,
    genre,
    multiple_search,
    max_results
  } = req.query

  // Multiple searching
  if (multiple_search === 'true') {
    const multipleSearchResults = await getComics(
      {
        title: title ?? '',
        author: author ?? '',
        yearx: year ?? '',
        status: status ?? '',
        order: order ?? '',
        type: type ?? '',
        genre: genre ?? []
      },
      max_results
    )
    res.status(200).json({
      code: 200,
      message: `${multipleSearchResults.length} komik hasil pencarian`,
      queries: req.query,
      data: multipleSearchResults
    })

    return false
  }

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
