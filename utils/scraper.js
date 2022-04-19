import * as cheerio from 'cheerio'
import { join } from 'path'
import { slugs } from '../constants/blacklist'
import { baseURL } from '../constants/scraper'

/**
 * Mendapatkan konten HTML
 * @param {string} path path/slug komik
 */
async function getHTML(path = '') {
  const res = await fetch(join(baseURL, path))
    .then((res) => res.text())
    .catch(console.error)

  return cheerio.load(res, null, false)
}

/**
 * Mendapatkan komik
 * @param {object} query Query (ini akan dijadikan query string pada url)
 * @param {number} maxResults Jumlah maksimal daftar komik yang dikembalikan (0 sampai 30)
 * @return {array} Comics
 */
async function getComics(query = {}, maxResults = 30) {
  const q = new URLSearchParams(query)

  const $ = await getHTML(!query.s ? `/manga?${q}` : `?${q}`) // Jika ada query `s` maka jangan gunakan route `/manga`

  // Mengambil semua element dengan class `.bsx` yang ada di dalam `.mrgn > .listupd >.bs`
  const comicCards = $(`.listupd > .bs > .bsx`)

  // Comics
  const comics = []

  comicCards.map((i, element) => {
    const card = $(element)
    const type = card.find('.type').text()
    const title = card.find('a').attr('title')
    const thumb = card.find('img').attr('src').replace('225', '160')
    const details = card.find('a').attr('href').replace(baseURL, '')
    const chapters = parseFloat(card.find('.epxs').text().replace('Ch.', ''))
    const rating = parseFloat(card.find('.rating i').text())

    comics.push({
      type,
      title,
      thumb,
      details,
      chapters,
      rating
    })
  })

  // Response
  return comics
    .slice(0, max(maxResults))
    .filter(({ details }) => !slugs.includes(details.split('/')[2]))
}

/**
 * Menampilkan detail komik
 * @param {string} path path komik (misal: `/[type]/[slug]`)
 * @return {object} detail komik
 */
async function getDetailsComic(path) {
  const $ = await getHTML(path)

  // Info komik
  const info = $('.bigcontent')

  // Genres
  const genres = []
  info.find('.spe span:nth-child(1) a').map((i, element) => {
    const genre = $(element).text()
    genres.push(genre)
  })

  //  Chapters
  const chapters = []
  $('.bixbox.bxcl > ul > li').map((i, element) => {
    const chapter = $(element).find('.lchx a')
    chapters.push({
      title: chapter.text(),
      path: chapter.attr('href').replace(baseURL, '/read')
    })
  })

  // Info spesifik
  const details = {
    title: info.find('.thumb img').attr('alt'),
    thumb: info.find('.thumb img').attr('src'),
    description: info.find('span.desc p').text(),
    genres,
    status: info.find('.spe span:nth-child(2)').text().split(' ')[1],
    released: info.find('.spe span:nth-child(3)').text().split(' ')[1],
    author: info
      .find('.spe span:nth-child(4)')
      .text()
      .split(' ')
      .slice(1)
      .join(' '),
    type: info.find('.spe span:nth-child(5)').text().split(' ')[1],
    serialization: info
      .find('.spe span:nth-child(6)')
      .text()
      .split(' ')
      .slice(1)
      .join(' '),
    postedBy: info
      .find('.spe span:nth-child(7)')
      .text()
      .split(' ')
      .slice(2)
      .join(' '),
    postedOn: info
      .find('.spe span:nth-child(8)')
      .text()
      .split(' ')
      .slice(2)
      .join(' '),
    updatedOn: info
      .find('.spe span:nth-child(9)')
      .text()
      .split(' ')
      .slice(2)
      .join(' '),
    rating: parseFloat($('.rating strong').text().split(' ')[1]),
    chapters
  }

  // Response
  return details
}

/**
 * Mendapatkan halaman/gambar comic
 * @param {string} path path komik (misal: `/read/[slug]`)
 * @returns {array} pages
 */
async function getPagesOfComic(path) {
  const $ = await getHTML(path)

  // Title
  const title = $('.headpost h1').text()

  // Pages
  const pages = []
  $('#readerarea img').map((i, element) => {
    const image = $(element).attr('src')
    pages.push(image)
  })

  // Pagination
  const pagination = $('.nextprev')
  const prev = pagination.find('[rel="prev"]').attr('href')
  const next = pagination.find('[rel="next"]').attr('href')

  // Response
  return {
    title,
    pagination: {
      prev: prev ? prev.replace(baseURL, '/read') : null,
      next: next ? next.replace(baseURL, '/read') : null
    },
    pages
  }
}

/**
 * Mengatur jumlah maksimal daftar comic
 * @param {number} num angka yang akan divalidasi
 * @return {number}
 */
function max(num) {
  const n = parseInt(num.length === 0 ? 30 : num)
  return typeof n !== 'number' || n.toString() === 'NaN' ? 30 : n
}

module.exports = {
  getComics,
  getDetailsComic,
  getPagesOfComic
}
