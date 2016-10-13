var fs = require('fs');

// Open a specific file from a project
module.exports = function(root){
  return function open(mod, file, req){
    if (file instanceof Array) {
      return open(mod, file.find(name => open(mod, name, req)), req);
    }
    var path = mod + '/' + file;
    var ret = fs.existsSync(path) && (req ? require(path) : fs.readFileSync(path, 'utf8'));
    return ret;
  }
}
