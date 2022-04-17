import * as cheerio from 'cheerio'
import { join } from 'path'
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
 * Mendapatkan komik terbaru/terakhir dipost
 * @param {number} maxResults Jumlah maximal komik yg ditampilkan (Harus 0 - 30)
 * @return {array} Comics
 */
async function getLatestComics(maxResults = 30) {
  const $ = await getHTML('/manga')

  // Mengambil semua element dengan class `.bsx` yang ada di dalam `.mrgn > .listupd >.bs`
  const comicCards = $(`.mrgn > .listupd > .bs > .bsx`)

  // Comics
  const comics = []

  comicCards.map((i, element) => {
    const card = $(element)
    const type = card.find('.type').text()
    const title = card.find('a').attr('title')
    const thumb = card.find('img').attr('src')
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
  return comics.slice(0, max(maxResults))
}

/**
 * Mendapatkan komik populer
 * @param {boolean} today menampilkan komik populer hari ini
 * @returns {array} Comics
 */
async function getPopularComics(today = false) {
  const $ = await getHTML(
    !today ? '/pustaka?orderby=meta_value_num' : '/pustaka?orderby=modified'
  )

  // Mengambil semua element dengan class `.bge` yang ada di dalam `.daftar`
  const comicCards = $(`.daftar > .bge`)

  // Comics
  const comics = []

  comicCards.map((i, element) => {
    const elm = $(element)
    const cardHeader = $(elm).find('.bgei')
    const cardBody = $(elm).find('.kan')

    // Mempush comic ke dalam konstan `comics`
    comics.push({
      title: cardBody.find('h3').text().trim(),
      description: cardBody.find('p').text().split('\t').slice(1).join(''),
      thumb: cardHeader.find('img').attr('data-src'),
      detail: cardBody.find('a').attr('href').replace(baseURL, ''),
      type: cardHeader.find('.tpe1_inf b').text().trim(),
      views: cardBody
        .find('.judul2')
        .text()
        .split('•')[0]
        .replace('x', '')
        .trim(),
      updated: cardBody.find('.judul2').text().split('•')[1].trim(),
      chapters: parseFloat(
        cardBody
          .find('.new1')
          .slice(-1)
          .find('span:nth-child(2)')
          .text()
          .replace('Chapter', '')
          .trim()
      ),
      lastChapter: cardBody
        .find('.new1')
        .slice(-1)
        .find('a')
        .attr('href')
        .replace(baseURL, '')
    })
  })

  // Response
  return comics
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
  getLatestComics,
  getPopularComics,
  getDetailsComic,
  getPagesOfComic
}
