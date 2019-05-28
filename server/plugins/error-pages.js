/*
* Add an `onPreResponse` listener to return error pages
*/

const boom = require('@hapi/boom')

const API_CONTENT_TYPE = 'application/json'

module.exports = {
  plugin: {
    name: 'error-pages',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          // An error was raised during
          // processing the request
          const statusCode = response.output.statusCode

          // In the event of 404
          // return the `404` view
          if (statusCode === 404) {
            switch (request.headers['content-type']) {
              case API_CONTENT_TYPE:
                return boom.notFound()
              default:
                return h.view('404').code(statusCode)
            }
          }

          request.log('error', {
            statusCode: statusCode,
            data: response.data,
            message: response.message
          })

          // The return the `500` view
          switch (request.headers['content-type']) {
            case API_CONTENT_TYPE:
              return boom.badImplementation()
            default:
              return h.view('500').code(statusCode)
          }
        }
        return h.continue
      })
    }
  }
}
