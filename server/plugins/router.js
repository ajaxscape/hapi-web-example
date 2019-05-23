const routes = [].concat(
  require('../routes/api/contact'),
  require('../routes/home'),
  require('../routes/about'),
  require('../routes/public')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
