
const boom = require('@hapi/boom')

module.exports = class Handlers {
  constructor (Model) {
    this.Model = Model
  }

  async handleGet () {
    return this.Model.getAll()
  }

  async handleGetById (request) {
    const model = await this.Model.getById(request.params.id)
    if (model) {
      return model
    }
    return boom.notFound()
  }

  async handlePost (request) {
    const model = new this.Model(request.payload)
    return model.save()
  }

  async handlePatch (request) {
    const model = await this.Model.getById(request.params.id)
    if (model) {
      Object.assign(model, request.payload)
      return model.save()
    }
    return boom.notFound()
  }

  async handleDelete (request) {
    const model = await this.Model.getById(request.params.id)
    if (model) {
      return model.delete()
    }
    return boom.notFound()
  }

  async handleError (request, h, err) {
    if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
      const invalidItem = err.details[0]
      return h.response(`Data Validation Error. Schema violation. <${invalidItem.path}> \nDetails: ${JSON.stringify(err.details)}`)
        .code(400)
        .takeover()
    }

    return h.response(err)
      .takeover()
  }

  routes ({ path, params, post, patch }) {
    const handleGet = this.handleGet.bind(this)
    const handleGetById = this.handleGetById.bind(this)
    const handlePost = this.handlePost.bind(this)
    const handlePatch = this.handlePatch.bind(this)
    const handleDelete = this.handleDelete.bind(this)
    const handleError = this.handleError.bind(this)

    return [
      {
        method: 'GET',
        path,
        handler: handleGet,
        options: {
          tags: ['api']
        }
      }, {
        method: 'GET',
        path: `${path}/{id}`,
        handler: handleGetById,
        options: {
          tags: ['api'],
          validate: {
            params,
            failAction: handleError
          }
        }
      }, {
        method: 'POST',
        path,
        handler: handlePost,
        options: {
          tags: ['api'],
          validate: {
            payload: post,
            failAction: handleDelete
          }
        }
      }, {
        method: ['PUT', 'PATCH'],
        path: `${path}/{id}`,
        handler: handlePatch,
        options: {
          tags: ['api'],
          validate: {
            params,
            payload: patch,
            failAction: handleDelete
          }
        }
      }, {
        method: 'DELETE',
        path: `${path}/{id}`,
        handler: handleDelete,
        options: {
          tags: ['api'],
          validate: {
            params,
            failAction: handleDelete
          }
        }
      }
    ]
  }
}
