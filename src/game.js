const uuidv1 = require('uuid/v1')
require('datejs')

module.exports = class Game {
  constructor(id, name, bggId, year) {
    this.uuid = uuidv1()
    this.id = id
    this.name = name
    this.modificationName = new Date().toString("yyyy-MM-dd HH:mm:ss")
    this.cooperative = false
    this.highestWins = false
    this.noPoints = false
    this.usesTeams = false
    this.urlThumb = ''
    this.urlImage = ''
    this.bggName = name
    this.bggId = bggId
    this.bggYear = year
    this.designers = ''
  }
}
