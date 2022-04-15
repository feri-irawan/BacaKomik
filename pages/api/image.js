import request from 'request'

export default async function Image(req, res) {
  const { url } = req.query

  res.setHeader('Content-Type', 'image/jpeg')
  request.get(url).pipe(res)
}
