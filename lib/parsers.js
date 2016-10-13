var normalize = require('./normalize');

// Import all licenses
module.exports = require('fs').readdirSync(__dirname + '/../licenses').map(file =>
  require(__dirname + '/../licenses/' + file)
);


module.exports = module.exports.map(parser =>
  Object.assign(parser, { normalized: parser.text ? normalize(parser.text) : false })
);
