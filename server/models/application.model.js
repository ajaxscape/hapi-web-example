const uuid = require('uuid/v1')

const applications = {}

module.exports = class Application {
  constructor (data) {
    Object.assign(this, data)
  }

  static async getAll () {
    return Object.values(applications)
  }

  static async getById (id) {
    return applications[id]
  }

  async save () {
    if (!this.id) {
      this.id = uuid()
      applications[this.id] = this
    }
    return this.id
  }

  async delete () {
    if (this.id && applications[this.id]) {
      delete applications[this.id]
      return true
    }
    return false
  }
}