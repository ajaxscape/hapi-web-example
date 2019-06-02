const Joi = require('@hapi/joi')
const BaseModel = require('./base.model')

module.exports = class Contact extends BaseModel {
  static get schema () {
    return {
      firstName: Joi.string(),
      lastName: Joi.string()
    }
  }
}
