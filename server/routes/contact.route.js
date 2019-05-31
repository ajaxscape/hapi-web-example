
const Joi = require('@hapi/joi')
const { Contact } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Contact)

const postSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
}).label('Contact (Post)')

const patchSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string()
}).label('Contact (Patch)')

module.exports = handlers.routes({
  path: '/contacts',
  params: {
    id: Joi.string().guid()
  },
  post: postSchema,
  patch: patchSchema
})
