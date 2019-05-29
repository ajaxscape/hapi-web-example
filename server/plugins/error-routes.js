/*
* Add an `onPreResponse` listener to return error pages
*/

const boom = require('@hapi/boom')

module.exports = {
  plugin: {
    name: 'error-routes',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          // An error was raised during
          // processing the request
          const statusCode = response.output.statusCode

          // // In the event of 404
          // if (statusCode === 404) {
          //   return boom.notFound()
          // }

          request.log('error', {
            statusCode: statusCode,
            data: response.data,
            message: response.message
          })
        }
        return h.continue
      })
    }
  }
}
