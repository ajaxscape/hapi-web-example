const Joi = require('@hapi/joi')
const uuid = require('uuid/v1')

const contacts = {}

module.exports = class Contact {
  static get schema () {
    return {
      firstName: Joi.string(),
      lastName: Joi.string()
    }
  }

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
