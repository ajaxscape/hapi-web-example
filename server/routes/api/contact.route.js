// routes.js
const { Contact } = require('../../models')
const joi = require('@hapi/joi')
const path = '/contacts'

const handleError = function (request, h, err) {
  if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
    const invalidItem = err.details[0]
    return h.response(`Data Validation Error. Schema violation. <${invalidItem.path}> \nDetails: ${JSON.stringify(err.details)}`)
      .code(400)
      .takeover()
  }

  return h.response(err)
    .takeover()
}

module.exports = [
  {
    method: 'GET',
    path,
    options: {
      handler: async () => {
        return Contact.getAll()
      },
      tags: ['api']
    }
  }, {
    method: 'GET',
    path: `${path}/{id}`,
    options: {
      handler: async (request) => {
        return Contact.getById(request.params.id)
      },
      tags: ['api'],
      validate: {
        params: {
          id: joi.string().guid()
        },
        failAction: handleError
      }
    }
  }, {
    method: 'POST',
    path,
    options: {
      handler: async (request) => {
        const contact = new Contact(request.payload)
        return contact.save()
      },
      tags: ['api'],
      validate: {
        payload: joi.object({
          firstName: joi.string().required(),
          lastName: joi.string().required()
        }),
        failAction: handleError
      }
    }
  }, {
    method: ['PUT', 'PATCH'],
    path: `${path}/{id}`,
    options: {
      handler: async (request) => {
        const contact = await Contact.getById(request.params.id)
        Object.assign(contact, request.payload)
        contact.save()
      },
      tags: ['api'],
      validate: {
        params: {
          id: joi.string().guid()
        },
        payload: joi.object({
          firstName: joi.string(),
          lastName: joi.string()
        }),
        failAction: handleError
      }
    }
  }, {
    method: 'DELETE',
    path: `${path}/{id}`,
    options: {
      handler: async (request) => {
        const contact = await Contact.getById(request.params.id)
        return contact.delete()
      },
      tags: ['api'],
      validate: {
        params: {
          id: joi.string().guid()
        },
        failAction: handleError
      }
    }
  }
]
