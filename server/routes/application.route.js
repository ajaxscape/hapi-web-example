
const joi = require('@hapi/joi')
const { Application } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Application)

const schema = joi.object({
  categoryId: joi.string().guid(),
  contactId: joi.string().guid()
}).label('Application')

module.exports = handlers.routes({
  path: '/applications',
  params: {
    id: joi.string().guid()
  },
  post: schema,
  patch: schema
})
