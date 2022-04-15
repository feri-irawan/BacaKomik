import { getPopularComics } from '../../../utils/scraper'

export default async function Popular(req, res) {
  let today = false
  if (req.query.today === 'true') today = true

  const popular = await getPopularComics(today)

  res.status(200).json({
    code: 200,
    message: `Daftar ${popular.length} komik populer${
      today ? ' hari ini' : ''
    }.`,
    data: popular
  })
}
