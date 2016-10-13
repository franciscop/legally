var fs = require('fs');

// Extract the module name from a path
var name = path => path.split(/\//).pop().toLowerCase();

module.exports = function walk(root){
  var mod = root.replace(/\/$/, '') + '/node_modules/';
  if (!fs.existsSync(mod)) return [];

  // Read all of the current modules and load the correct ones
  var list = fs.readdirSync(mod).filter(e => !/^\./.test(e)).map(e => mod + e);

  // Add all of the children in a flattened array
  list = list.reduce((all, e) => all.concat(walk(e)), list);

  // Alphabetically sort it
  return list.sort((a, b) => name(a) > name(b) ? 1 : name(a) < name(b) ? -1 : 0);
}
