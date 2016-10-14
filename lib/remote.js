var fs = require('fs');
var exec = command => require('child_process').execSync(command).toString();

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports = function (packages, callback){
  var tmp = process.cwd() + '/.tmp';
  if (!fs.existsSync(tmp)){
    fs.mkdirSync(tmp);
  }
  var root = tmp + '/legally';
  deleteFolderRecursive(root);
  fs.mkdirSync(root);
  if (!fs.existsSync(tmp)){
    console.log("WTF?");
  }
  //var ret = exec('cd ' + root + ' && npm init --silent');
  console.log("Working on it. It will take a while...");
  var commands = [
    'cd "' + root + '"',
    'npm init --yes',
    'npm install ' + packages.join(' ') + ' --save --ignore-scripts'
  ];
  var ret = exec(commands.join(' && '));
  callback(null, root);
  deleteFolderRecursive(root);
}
