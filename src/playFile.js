class PlayFile {
  constructor(players, games, plays) {
    this.about = 'This is a Play file that can be read by Board Game Stats. If you see this text, try to use a share,'
      + 'export or open-in function to open it with Board Game Stats.'
    this.players = players
    this.locations = []
    this.games = games
    this.plays = plays
    this.userInfo = {'meRefId': 1}
  }
}