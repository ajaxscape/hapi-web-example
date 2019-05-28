const hapi = require('@hapi/hapi')
const config = require('./config')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  // Register the plugins
  await server.register([
    require('@hapi/inert'),
    require('./plugins/views'),
    require('./plugins/validate-params'),
    require('./plugins/hapi-router'),
    require('./plugins/error-pages')
  ])

  if (config.isDev) {
    await server.register([
      require('blipp'),
      require('./plugins/logging'),
      require('./plugins/hapi-swagger')
    ])
  }

  return server
}

module.exports = createServer
