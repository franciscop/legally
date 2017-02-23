var files = require('./files');
var license = require('./license');
var package = require('./package');
var open = require('./open');
var folders = require('./folders');

function getPackage(path){
  var name;
  var split = path.split(/\//);
  if (path.indexOf("@types") >= 0) {
    name = split.slice(-2).join('/');
  } else if (path.indexOf('@') >= 0) {
    name = split[split.length - 2] + '/' + split.pop();
  } else {
    name = split.pop();
  }
  var pkg = require(path + '/package.json');
  return name + '@' + pkg.version;
}

// Root project to analize
module.exports = root => {
  var packages = [];

  // Traverse folders in node_modules to check for @scoped packages
  folders(root, false).map((path) => {
    if (path.split(/\//).pop().indexOf('@') >= 0) {
      folders(path + '/', true).map(scopedPackage => packages.push(scopedPackage));
    } else {
      packages.push(path);
    }
  });

  return packages.reduce((all, path) =>
    Object.assign(all, {
      [getPackage(path)]: {
        package: package(open(root)(path, 'package.json', true)),
        license: license(open(root)(path, files.license), ['? verify']),
        readme: license(open(root)(path, files.readme))
      }
    }), {});
};
