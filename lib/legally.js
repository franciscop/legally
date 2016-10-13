var fs = require('fs');
var files = require('./files');
var license = require('./license');
var package = require('./package');
var open = require('./open');

function folders(root){
  var execFile = require('child_process').execSync;
  var res = execFile('find', [root, '-type', 'd', '-name', '*node_modules/']);
  var ret = res.toString().split('\n')
    .filter(f => /node_modules\/[^\/]+$/.test(f))
    .filter(name => !/\/.bin$/.test(name))
    .map(name => root + name.replace(/^\./, ''))
    .sort((a, b) => {
      var namea = a.split(/\//).pop().toLowerCase();
      var nameb = b.split(/\//).pop().toLowerCase();
      if (namea > nameb) return 1;
      if (namea < nameb) return -1;
      return 0;
    });
  return ret;
}

// Root project to analize
module.exports = root => folders(root).reduce((all, path) =>
  Object.assign(all, {
    [path.split(/\//).pop()]: {
      package: package(open(root)(path, 'package.json', true)),
      license: license(open(root)(path, files.license)),
      readme: license(open(root)(path, files.readme))
    }
  }
), {});
