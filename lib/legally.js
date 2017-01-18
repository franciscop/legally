var files = require('./files');
var license = require('./license');
var package = require('./package');
var open = require('./open');
var folders = require('./folders');

function getPackage(path){
  var name;
  if (path.indexOf("@types") >= 0) {
    name = path.split(/\//).slice(-2).join('/');
  } else {
    name = path.split(/\//).pop();
  }
  var pkg = require(path + '/package.json');
  return name + '@' + pkg.version;
}

// Root project to analize
module.exports = root => folders(root).reduce((all, path) =>
  Object.assign(all, {
    [getPackage(path)]: {
      package: package(open(root)(path, 'package.json', true)),
      license: license(open(root)(path, files.license), ['? verify']),
      readme: license(open(root)(path, files.readme))
    }
  }
), {});
