const rp = require('request-promise')
const $ = require('cheerio')
require('datejs')
const uuidv1 = require('uuid/v1')
const args = require('yargs').argv
const fs = require('fs')
const Game = require('./game.js')
const Player = require('./player.js')
const PlayerScore = require('./playerScore.js')
const PlayFile = require('./playFile.js')
const Play = require('./play.js')

const gameSelector = 'h3 > a'
const dateSelector = 'dt:contains("Data")'
const numberOfPlaysSelector = 'dt:contains("Quantidade")'
const durationSelector = 'dt:contains("Duração")'
const usersSelector = 'table#tbl-jogadores img.user-avatar-sm.hidden-xs + *'
const trophySelector = 'table#tbl-jogadores td:nth-child(2)'
const pointsSelector = 'table#tbl-jogadores td:nth-child(3)'
let objectIdCount = 1
const playersMap = new Map()
const gamesMap = new Map()

const getLastPageNumber = async (userId) => {
  const url = `https://www.ludopedia.com.br/partidas?id_usuario=${userId}&v=detalhado`
  const html = await rp(url)
    .catch(err => {
      console.error(`Failed: ${err}`)
    })
  const lastPageJson = $('a[title = "Última Página"]', html)
  let lastPageUrl = url + '&pagina=1'
  if (lastPageJson[0])
    lastPageUrl = lastPageJson[0].attribs.href
  return lastPageUrl
}

const getMatches = async (userId, page) => {
  const url = `https://www.ludopedia.com.br/partidas?id_usuario=${userId}&v=detalhado&pagina=${page}`
  const html = await rp(url)
    .catch(err => {
      console.error(`Failed: ${err}`)
    })
  let matchesJson = $('div.media.bord-btm > div > a', html)
  let matchesLinks = []
  for (let i = 0; i < matchesJson.length; i++) {
    matchesLinks.push(matchesJson[i].attribs.href)
  }
  return matchesLinks
}

const getMatchInformation = async (url) => {
  const html = await getInfoFromLudopediaWithRetry(url, 10)
  const play = new Play()
  console.log(`Adding match. Game: ${$(gameSelector, html).text()}`)
  play.setGameId(await getGameAddingToMap($(gameSelector, html).text()))
  play.setDate(formatDate($(dateSelector, html).next('dd').text()))
  play.setDuration(getMinutesFromDuration($(durationSelector, html).next('dd').text()))
  const usersJs = $(usersSelector, html)
  const trophyJs = $(trophySelector, html)
  const pointsJs = $(pointsSelector, html)
  const playerScores = []
  for (let i = 0; i < usersJs.length; i++) {
    const userId = getPlayerIdAddingToMap(usersJs.eq(i).text().trim())
    const playerScore = new PlayerScore()
    playerScore.setUserId(userId)
    playerScore.setWinner(trophyJs.eq(i).has('i').length > 0)
    playerScore.setScore(Number(pointsJs.eq(i).text().trim()))
    playerScores.push(playerScore)
  }
  play.setPlayerScores(playerScores)
  const numberOfPlays = Number(($(numberOfPlaysSelector, html).next('dd').text()))
  let plays = Array(numberOfPlays).fill(play)
  if (plays.length > 1) {
    plays = plays.map((mappedPlay, index) => {
      let newPlay = Object.assign({}, mappedPlay)
      const timeToAdd = mappedPlay.durationMin * index
      const newDate = Date.parse(mappedPlay.playDate).add(timeToAdd).minute()
      newPlay.playDate = formatDate(newDate)
      newPlay.uuid = uuidv1()
      return newPlay
    })
  }
  return plays
}

const getInfoFromLudopediaWithRetry = async (url, retries) => {
  try {
    return await rp(url)
  } catch (err) {
    console.log(`Retrying to get information. Exception was: ${err}`)
    if(retries > 0)
      return await getInfoFromLudopediaWithRetry(url, retries - 1)
    else {
      console.error(`Error getting information from Ludopedia`)
      throw "Error getting Game"
    }
  }
}

const getPlayerIdAddingToMap = (playerName) => {
  let playerId
  if (playersMap.has(playerName)) {
    playerId = playersMap.get(playerName).id
  } else {
    const newPlayer = new Player(objectIdCount++, playerName)
    playerId = newPlayer.id
    playersMap.set(playerName, newPlayer)
  }
  return playerId
}

const formatDate = (date) => {
  return Date.parse(date).toString('yyyy-MM-dd HH:mm:ss')
}

const getMinutesFromDuration = (duration) => {
  let hours = 0, minutes = 0
  const regexHour = /([\d]*) hora[s]?/g
  if (duration.match(regexHour))
    hours = Number(regexHour.exec(duration)[1])
  const regexMinutes = /([\d]*) minuto[s]?/g
  if (duration.match(regexMinutes))
    minutes = Number(regexMinutes.exec(duration)[1])
  return minutes + (hours * 60)
}

const getGameAddingToMap = async (gameName) => {
  let gameId
  if (gamesMap.has(gameName)) {
    gameId = gamesMap.get(gameName).id
  } else {
    const [bggId, year] = await getBggGameInfo(gameName)
    let newGame = new Game(objectIdCount++, gameName, Number(bggId), Number(year))
    if (bggId == null) {
      newGame.bggId = undefined
      newGame.bggYear = undefined
    }
    gamesMap.set(gameName, newGame)
    gameId = newGame.id
  }
  return gameId
}

const getBggGameInfo = async (gameName) => {
  let sanitizedName = encodeURIComponent(gameName)
  sanitizedName = sanitizedName.replace('\'', '%27')
  const xml = await rp(`https://www.boardgamegeek.com/xmlapi2/search?type=boardgame&query=${sanitizedName}&exact=1`)
    .catch(err => {
      console.error(`Failed: ${err}`)
    })
  const bggId = $('item', xml, {xmlMode: true}).attr('id')
  const year = $('yearpublished', xml, {xmlMode: true}).attr('value')
  return [bggId, year]
}

const getQueryParam = (url, param) => {
  const pattern = `[?&]${param}=(.*?)(&|$)`
  const regex = new RegExp(pattern, 'g')
  return regex.exec(url)[1]
}

(async () => {
  if (!args.userId)
    throw 'No user provided. please use the "--userId=\<LudopediaUser\>" option'
  getPlayerIdAddingToMap('Ludopedia')
  console.log(`Getting matches for ludopedia user: ${args.userId}`)
  Date.i18n.setLanguage('pt-BR')
  const lastPageUrl = await getLastPageNumber(args.userId)
  const lastPage = getQueryParam(lastPageUrl, 'pagina')
  let matches = []
  for (let i = 1; i <= lastPage; i++) {
    console.log(`getting page ${i}`)
    matches = matches.concat(await getMatches(args.userId, i))
  }
  console.log(`${matches.length} matches found. Getting information`)
  let plays = []
  for (let i = 0; i < matches.length; i++) {
    plays = plays.concat(await getMatchInformation(matches[i]))
  }
  console.log(`${plays.length} plays found.`)
  let playersList = Array.from(playersMap.values())
  console.log(`${playersList.length} different players found.`)
  let gamesList = Array.from(gamesMap.values())
  console.log(`${gamesList.length} different games found.`)
  const playFileObject = new PlayFile(playersList, gamesList, plays)
  const fileNameDate = new Date().toString('yyyy-MM-dd-HH-mm-ss')
  fs.writeFile(`ludopedia-export-${fileNameDate}.bgsplay`, JSON.stringify(playFileObject), 'utf8', () => {
    console.log(`All Matches exported successfully. Verify the users in the file before exporting.`)
  })
})().catch(err => {
  console.error(err)
})

