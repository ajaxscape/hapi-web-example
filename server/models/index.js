const requireAll = require('require-all')

// Requires all the models in the current folder
module.exports = requireAll({
  dirname: __dirname,
  filter: /^(.+).model\.js$/,
  map: (name) => name.charAt(0).toUpperCase() + name.slice(1)
})
