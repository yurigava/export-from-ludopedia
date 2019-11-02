class PlayerScore {
  constructor() {
    this.newPlayer = false
    this.startPlayer = false
    this.role = ''
    this.rank = 0
    this.seatOrder = 0
  }

  setScore(score) {
    this.score = score
  }

  setWinner(isWinner) {
    this.winner = isWinner
  }

  setUserId(id) {
    this.playerRefId = id
  }
}