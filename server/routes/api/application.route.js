
const joi = require('@hapi/joi')
const { Application } = require('../../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Application)

module.exports = handlers.routes({
  path: '/applications',
  params: {
    id: joi.string().guid()
  },
  post: joi.object({
    categoryId: joi.string().required(),
    contactId: joi.string()
  }),
  patch: joi.object({
    categoryId: joi.string(),
    contactId: joi.string()
  })
})
