import * as cheerio from 'cheerio'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const URL = {
    schedule: 'https://www.futbolred.com/parrilla-de-futbol'
}

async function scrape(url) {
    const res = await fetch(url)
    const html = await res.text()
    return cheerio.load(html)
}

async function getInfoMatchs() {
    const partidos = []
    const $ = await scrape(URL.schedule)
    const $first = $('.tabla-lista-partidos').first()
    const $rowsInfo = $first.find('table tbody tr')

    const cleanText = text => text.replace(/\s+/g, ' ')
    $rowsInfo.each((index, el) => {
        const $el = $(el)
        const partido = cleanText($el.find('.partido').text().trim())
        const liga = $el.find('.liga').text().trim()
        const hora = $el.find('.hora').text().trim()
        const canal = $el.find('.canal').text().trim()

        partidos.push({
            partido,
            liga,
            hora,
            canal
        })
    })
    
    return partidos
}
const infoPartidos = await getInfoMatchs()

const filePath = path.join(process.cwd(), './db/matchToday.json')

await writeFile(filePath, JSON.stringify(infoPartidos, null, 2), 'utf-8')