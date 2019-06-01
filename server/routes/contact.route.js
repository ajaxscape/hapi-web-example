
const Joi = require('@hapi/joi')
const { Contact } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Contact)

module.exports = handlers.routes({
  path: '/contacts',
  params: {
    id: Joi.string().guid()
  },
  schema: Joi.object(Contact.schema).label('Contact')
})
