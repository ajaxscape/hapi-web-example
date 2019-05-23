// routes.js
const { Contact = {} } = {} // ToDo: require('./models')

module.exports = [
  {
    method: 'GET',
    path: '/contacts',
    options: {
      handler: () => {
        return Contact.findAll()
      },
      tags: ['api']
    }
  }, {
    method: 'GET',
    // The curly braces are how we define params (variable path segments in the URL)
    path: '/contacts/{id}',
    options: {
      handler: (request) => {
        return Contact.findById(request.params.id)
      },
      tags: ['api']
    }
  }, {
    method: 'POST',
    path: '/contacts',
    options: {
      handler: (request) => {
        const contact = Contact.build(request.payload.contact)

        return contact.save()
      },
      tags: ['api']
    }
  }, {
    // method can be an array
    method: ['PUT', 'PATCH'],
    path: '/contacts/{id}',
    options: {
      handler: async (request) => {
        const contact = await Contact.findById(request.params.id)
        contact.update(request.payload.contact)

        return contact.save()
      },
      tags: ['api']
    }
  }, {
    method: 'DELETE',
    path: '/contacts/{id}',
    options: {
      handler: async (request) => {
        const contact = await Contact.findById(request.params.id)

        return contact.destroy()
      },
      tags: ['api']
    }
  }
]
