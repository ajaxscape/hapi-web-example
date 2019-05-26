// routes.js
const { Contact } = require('./models')
const path = '/contacts(api)'

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
      tags: ['api']
    }
  }, {
    method: 'POST',
    path,
    options: {
      handler: async (request) => {
        const contact = new Contact(request.payload)
        return contact.save()
      },
      tags: ['api']
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
      tags: ['api']
    }
  }, {
    method: 'DELETE',
    path: `${path}/{id}`,
    options: {
      handler: async (request) => {
        const contact = await Contact.getById(request.params.id)
        return contact.delete()
      },
      tags: ['api']
    }
  }
]
