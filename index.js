const rp = require('request-promise');
const $ = require('cheerio');

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
  console.log($('h3 > a', html).text())
  console.log($('dt:contains("Data")', html).next('dd').text())
  console.log($('dt:contains("Quantidade")', html).next('dd').text())
  console.log($('dt:contains("Duração")', html).next('dd').text())
  console.log($('dt:contains("Detalhes")', html).next('dd').text())
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
  getMatchInformation('https://www.ludopedia.com.br/partida?id_partida=242817')
})()

