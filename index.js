const rp = require('request-promise');
const $ = require('cheerio');

const gameSelector = 'h3 > a'
const dateSelector = 'dt:contains("Data")'
const numberOfPlaysSelector = 'dt:contains("Quantidade")'
const durationSelector = 'dt:contains("Duração")'
const detailsSelector = 'dt:contains("Detalhes")'
const usersSelector = 'table#tbl-jogadores img.user-avatar-sm.hidden-xs + *'
const trophySelector = 'table#tbl-jogadores td:nth-child(2)'
const pointsSelector = 'table#tbl-jogadores td:nth-child(3)'
const obsSelector = 'table#tbl-jogadores td:nth-child(4)'
const expansionsSelector = 'h3 + table#tbl-jogadores td:nth-child(1) > img.user-avatar-sm + *'

let getLastPageNumber = async (userId) =>  {
  const url = `https://www.ludopedia.com.br/partidas?id_usuario=${userId}&v=detalhado`
  const html = await rp(url)
    .catch(err => {
      console.error(`Failed: ${err}`)
    })
  let lastPageJson = $('a[title = "Última Página"]', html)
  return lastPageJson[0].attribs.href
}

let getMatches = async (userId, page) => {
  const url = `https://www.ludopedia.com.br/partidas?id_usuario=${userId}&v=detalhado&pagina=${page}`;
  const html = await rp(url)
    .catch(err => {
      console.error(`Failed: ${err}`)
    })
  let matchesJson = $('div.media.bord-btm > div > a', html)
  let matchesLinks = []
  for(let i = 0; i < matchesJson.length; i++) {
    matchesLinks.push(matchesJson[i].attribs.href)
  }
  return matchesLinks
}

let getMatchInformation = async (url) => {
  const html = await rp(url)
    .catch(err => {
      console.error(`Failed: ${err}`)
    })
  console.log($(gameSelector, html).text())
  console.log($(dateSelector, html).next('dd').text())
  console.log($(numberOfPlaysSelector, html).next('dd').text())
  console.log($(durationSelector, html).next('dd').text())
  console.log($(detailsSelector, html).next('dd').text())
  const usersJs = $(usersSelector, html);
  const trophyJs = $(trophySelector, html)
  const pointsJs = $(pointsSelector, html)
  const obsJs = $(obsSelector, html);
  const expJs = $(expansionsSelector, html)
  for (let i = 0; i < usersJs.length; i++) {
    console.log(usersJs.eq(i).text().trim())
    console.log(trophyJs.eq(i).has('i').length)
    console.log(pointsJs.eq(i).text().trim())
    console.log(obsJs.eq(i).text().trim())
  }
  for (let i = 0; i < expJs.length; i++) {
    console.log(expJs.eq(i).text().trim())
  }
}

let getQueryParam = (url, param) => {
  const pattern = `[?&]${param}=(.*?)(&|$)`
  const regex = new RegExp(pattern, "g")
  return regex.exec(url)[1]
}


(async () => {
  /*const lastPageUrl = await getLastPageNumber('59657')
  const lastPage = getQueryParam(lastPageUrl, "pagina")
  const lastPage = 1;
  let matches = []
  for(let i = 1; i <= lastPage; i++) {
    console.log(`getting ${i} page`)
    matches = matches.concat(await getMatches('59657', i));
  }*/
  getMatchInformation('https://www.ludopedia.com.br/partida?id_partida=217581')
})()

