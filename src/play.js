class Play {
  constructor() {
    this.uuid = ''
    this.modificationName = new Date()
    this.entryDate = new Date()
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
}