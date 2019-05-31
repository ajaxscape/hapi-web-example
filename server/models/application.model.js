const Joi = require('@hapi/joi')
const uuid = require('uuid/v1')

const applications = {}

module.exports = class Application {
  static get schema () {
    return {
      categoryId: Joi.string().guid(),
      contactId: Joi.string().guid()
    }
  }

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
    return this
  }

  async delete () {
    if (this.id && applications[this.id]) {
      delete applications[this.id]
      return true
    }
    return false
  }
}
