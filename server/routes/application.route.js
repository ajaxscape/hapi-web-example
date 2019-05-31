
const Joi = require('@hapi/joi')
const { Application } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Application)

const schema = Joi.object({
  categoryId: Joi.string().guid(),
  contactId: Joi.string().guid()
}).label('Application')

module.exports = handlers.routes({
  path: '/applications',
  params: {
    id: Joi.string().guid()
  },
  post: schema,
  patch: schema
})
