
const joi = require('@hapi/joi')
const { Contact } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Contact)

const postSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required()
}).label('Contact (Post)')

const patchSchema = joi.object({
  firstName: joi.string(),
  lastName: joi.string()
}).label('Contact (Patch)')

module.exports = handlers.routes({
  path: '/contacts',
  params: {
    id: joi.string().guid()
  },
  post: postSchema,
  patch: patchSchema
})
