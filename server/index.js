const hapi = require('@hapi/hapi')
const config = require('./config')
const requireAll = require('require-all')

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

  // // Register the plugins
  // await server.register(Object.values(requireAll({
  //   dirname: __dirname,
  //   filter: /^(.+)\.js$/
  // })))
  // //   [
  // //   require('./plugins/inert'),
  // //   require('./plugins/views'),
  // //   require('./plugins/hapi-router'),
  // //   require('./plugins/hapi-robots'),
  // //   require('./plugins/error-routes')
  // // ])

  // Register the plugins
  await server.register([
    require('./plugins/inert'),
    require('./plugins/views'),
    require('./plugins/hapi-router'),
    require('./plugins/hapi-robots'),
    require('./plugins/error-routes')
  ])

  if (config.isDev) {
    await server.register([
      require('./plugins/development/blipp'),
      require('./plugins/development/logging'),
      require('./plugins/development/hapi-swagger')
    ])
  }

  return server
}

module.exports = createServer
