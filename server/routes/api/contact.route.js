
const joi = require('@hapi/joi')
const { Contact } = require('../../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Contact)

module.exports = handlers.routes({
  path: '/contacts',
  params: {
    id: joi.string().guid()
  },
  post: {
    firstName: joi.string().required(),
    lastName: joi.string().required()
  },
  patch: {
    firstName: joi.string(),
    lastName: joi.string()
  }
})
