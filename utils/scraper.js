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
 * @return {array} Comic
 */
async function getLatestComics() {
  const $ = await getHTML()

  // Mengambil semua element dengan class `.ls4` yang ada di dalam `#Terbaru`
  const comicCards = $('#Terbaru > .ls4w > .ls4')

  // Comics
  const comics = []

  comicCards.map((i, element) => {
    const elm = $(element)
    const ls4v = $(elm).find('.ls4v')
    const ls4j = $(elm).find('.ls4j')

    // Mempush comic ke dalam konstan `comics`
    comics.push({
      title: ls4j.find('h4').text().trim(),
      type: ls4j.find('.ls4s').html(),
      thumb: ls4v.find('img').attr('data-src'),
      detail: ls4v.find('a').attr('href'),
      views: ls4v.find('.vw').text().trim(),
      chapters: Number(ls4j.find('.ls24').text().replace('Chapter', '').trim()),
      lastChapter: ls4j.find('.ls24').attr('href')
    })
  })

  // Response
  return comics
}

/**
 * Mendapatkan komik populer
 * @param {boolean} today menampilkan komik populer hari ini
 * @returns {array} Comics
 */
async function getPopularComics(today = false) {
  const $ = await getHTML(
    !today
      ? '/other/hot/?orderby=meta_value_num'
      : '/other/hot/?orderby=modified'
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
      type: cardHeader.find('.tpe1_inf b').text().trim(),
      thumb: cardHeader.find('img').attr('data-src'),
      detail: cardBody.find('a').attr('href').replace(baseURL, ''),
      views: cardHeader.find('.vw').text().replace('pembaca', '').trim(),
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
 * @param {string} path path atau slug komik
 * @return {object} detail komik
 */
async function getDetailsComic(path) {
  const $ = await getHTML(path)

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
async function getPagesOfComic(path) {
  const $ = await getHTML(join('ch', path))

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

module.exports = {
  getLatestComics,
  getPopularComics,
  getDetailsComic,
  getPagesOfComic
}
