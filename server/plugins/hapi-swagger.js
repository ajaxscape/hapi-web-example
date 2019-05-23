const pkg = require('../../package.json')

module.exports = {
  plugin: require('hapi-swagger'),
  options: {
    info: {
      title: 'Test API Documentation',
      version: pkg.version
    }
  }
}
