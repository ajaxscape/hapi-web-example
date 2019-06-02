const Joi = require('@hapi/joi')
const BaseModel = require('./base.model')

module.exports = class Application extends BaseModel {
  static get schema () {
    return {
      categoryId: Joi.string().guid(),
      contactId: Joi.string().guid()
    }
  }
}
