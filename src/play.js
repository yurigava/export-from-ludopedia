const uuidv1 = require('uuid/v1')
require('datejs')

module.exports = class Play {
  constructor() {
    this.uuid = uuidv1()
    this.modificationName = new Date().toString("yyyy-MM-dd HH:mm:ss")
    this.entryDate = new Date().toString("yyyy-MM-dd HH:mm:ss")
    this.usesTeams = false
    this.ignored = false
    this.manualWinner = true
    this.rounds = 0
    this.scoringSetting = 0
  }

  setGameId(gameId) {
    this.gameRefId = gameId
  }

  setDate(date) {
    this.playDate = date
  }

  setDuration(durationMin) {
    this.durationMin = durationMin
  }

  setPlayerScores(playerScores) {
    this.playerScores = playerScores
  }

  setNewUuid() {
    this.uuid = uuidv1()
  }
}
