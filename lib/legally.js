var fs = require('fs');
var files = require('./files');
var license = require('./license');
var package = require('./package');
var open = require('./open');
var folders = require('./folders');

// Root project to analize
module.exports = root => folders(root).reduce((all, path) =>
  Object.assign(all, {
    [path.split(/\//).pop()]: {
      package: package(open(root)(path, 'package.json', true)),
      license: license(open(root)(path, files.license), ['? verify']),
      readme: license(open(root)(path, files.readme))
    }
  }
), {});
