const Joi = require('@hapi/joi')
const uuid = require('uuid/v1')

const models = {}

module.exports = class BaseModel {
  static get schema () {
    throw new Error(`The schema getter needs to be implemented within the ${this.constructor.name} class`)
  }

  constructor (data) {
    const { value, error } = Joi.validate(data, this.constructor.schema, { abortEarly: false })
    if (error) {
      throw new Error(`The constructor data is invalid. ${error.message}`)
    } else {
      Object.assign(this, value)
    }
  }

  static async getAll () {
    return Object.values(models)
  }

  static async getById (id) {
    return models[id]
  }

  async save () {
    if (!this.id) {
      this.id = uuid()
      models[this.id] = this
    }
    return this
  }

  async delete () {
    if (this.id && models[this.id]) {
      delete models[this.id]
      return true
    }
    return false
  }
}
