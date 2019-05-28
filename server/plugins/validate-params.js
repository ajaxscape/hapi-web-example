
const joi = require('@hapi/joi')

module.exports = {
  plugin: {
    name: 'validate-params',
    register: (server, options) => {
      server.ext('onRequest', (request, h) => {
        if (request.params) {
          joi.validate(request.params, {
            params: {
              id: joi.string().guid()
            }
          })
        }
        return h.continue
      })
    }
  }
}
