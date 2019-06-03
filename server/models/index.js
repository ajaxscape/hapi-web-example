const requireAll = require('require-all')

// Requires all the models in the current folder
// eg. when the models directory contains files /application.model.js and /contact.model.js they will be exported as an array of classes [ Application, Contact ]
module.exports = requireAll({
  dirname: __dirname,
  filter: /^(.+).model\.js$/,
  map: (name) => name.charAt(0).toUpperCase() + name.slice(1)
})
