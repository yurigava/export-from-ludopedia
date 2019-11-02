class Game {
  constructor(id, name, bggId, year) {
    this.uuid = ''
    this.id = id
    this.name = name
    this.modificationName = new Date()
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