const uuidv1 = require('uuid/v1')

module.exports = class Player {
  constructor(id, name) {
    this.uuid = uuidv1()
    this.id = id
    this.isAnononymous = false
    this.bggUsername = ''
    this.name = name
  }
}
