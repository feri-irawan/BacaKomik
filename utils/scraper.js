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
 * @param {string} html HTML (yang dihasilkan /api/details)
 * @return {object} detail komik
 */
async function getDetailsComic(html) {
  const $ = cheerio.load(html, null, false)

  // Base sections
  const header = $('#Judul')
  const info = $('#Informasi')
  const sinopsis = $('#Sinopsis')

  // Push chapters
  const chapters = []
  $('#Daftar_Chapter')
    .find('tr')
    .slice(1)
    .map((i, element) => {
      const tr = $(element)
      const chapter = tr
        .find('td:nth-child(1)')
        .text()
        .split('\t')
        .join('')
        .slice(2, -1)
        .replace('Chapter', '')
        .trim()

      const updated = tr
        .find('td:nth-child(2)')
        .text()
        .split('\t')
        .join('')
        .slice(1)
      const path = tr.find('td:nth-child(1) a').attr('href')

      chapters.push({
        chapter,
        updated,
        path
      })
    })

  // Genre
  const genre = []
  info.find('ul.genre li.genre').map((i, element) => {
    const li = $(element).text()
    genre.push(li)
  })

  // Spesific sections
  const details = {
    title: {
      en: header.find('h1').text().trim(),
      id: header.find('.j2').text().trim()
    },
    description: header.find('.desc').text().trim(),
    thumb: info.find('.ims > img').attr('src').replace('w=225', 'w=300'),
    type: info.find('tr:nth-child(2)').find('td:nth-child(2)').text(),
    genre,
    concept: info.find('tr:nth-child(3)').find('td:nth-child(2)').text(),
    author: info.find('tr:nth-child(4)').find('td:nth-child(2)').text(),
    status: info.find('tr:nth-child(5)').find('td:nth-child(2)').text(),
    readerAge: info.find('tr:nth-child(6)').find('td:nth-child(2)').text(),
    views: info.find('tr:nth-child(7)').find('td:nth-child(2)').text(),
    howToRead: info.find('tr:nth-child(8)').find('td:nth-child(2)').text(),
    sinopsis: sinopsis
      .find('h2:contains("Sinopsis Lengkap")')
      .next()
      .text()
      .split('\t')
      .join('')
      .slice(1),
    chapters
  }

  // Response
  return details
}

/**
 * Mendapatkan halaman/gambar comic
 * @param {string} path path (chapter)
 * @returns {array} pages
 */
async function getPagesOfComic(html) {
  // const $ = await getHTML(join('ch', path))
  const $ = cheerio.load(html, null, false)

  // Title
  const title = $('#Judul > h1').text().slice(1).trim()

  // Container halaman
  const container = $('#Baca_Komik')

  // Mendapatkan halaman (gambar komik)
  const pages = []
  container.find('img').map((i, element) => {
    const img = $(element)
      .attr('src')
      .replace('cdn.komiku.co.id', 'img.komiku.id')
    pages.push(img)
  })

  const paginations = []

  $('.botmenu .nxpr')
    .find('.rl')
    .map((i, element) => {
      const path = $(element).attr('href')
      const title =
        $(element).find('svg').attr('data-icon') === 'caret-left'
          ? 'Sebelumnya'
          : 'Selanjutnya'

      paginations.push({ title, path })
    })

  // Response
  return { title, paginations, pages }
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
