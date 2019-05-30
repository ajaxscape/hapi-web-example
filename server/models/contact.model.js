const uuid = require('uuid/v1')

const contacts = {}

module.exports = class Contact {
  constructor (data) {
    Object.assign(this, data)
  }

  static async getAll () {
    return Object.values(contacts)
  }

  static async getById (id) {
    return contacts[id]
  }

  async save () {
    if (!this.id) {
      this.id = uuid()
      contacts[this.id] = this
    }
    return this
  }

  async delete () {
    if (this.id && contacts[this.id]) {
      delete contacts[this.id]
      return true
    }
    return false
  }
}
