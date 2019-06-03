const config = require('../config')

const squeezeConfig = [{
  'error': '*',
  'log': '*',
  'ops': '*',
  'request': '*',
  'response': '*'
}]

module.exports = {
  plugin: require('good'),
  options: {
    ops: {
      // Log ops stats every 30 seconds
      interval: 30000
    },
    reporters: {
      // Output to console
      consoleReporter: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: squeezeConfig
        }, {
          module: 'good-console',
          args: [
            {
              format: 'YYYY-MM-DD HH:mm:ss',
              utc: false
            }]
        }, 'stdout'],

      // Output to file
      fileReporter: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: squeezeConfig
        }, {
          module: 'good-squeeze',
          name: 'SafeJson'
        }, {
          module: 'good-file',
          args: ['./log/' + config.env + '.log']
        }]
    }
  }
}
