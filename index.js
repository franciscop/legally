#!/usr/bin/env node

var fs = require('fs');
var normalize = require('./lib/normalize');

// Import all licenses
var parsers = require('fs').readdirSync(__dirname + '/licenses').map(file =>
  require('./licenses/' + file)
);

// Root project to analize
var root = process.cwd();

// Open a specific file from a project
function open(mod, file, req){
  var path = root + '/node_modules/' + mod + '/' + file;
  return fs.existsSync(path) && (req ? require(path) : fs.readFileSync(path, 'utf8'));
}


// Default fields so the '?...' pop up first
var deff = {
  package: { '?none': [], '?verify': [] },
  file: { '?none': [], '?verify': [] },
  readme: { '?none': [], '?verify': [] },
  total: { '?none': [], '?invalid': [], '?multiple': [] },
  modules: {}
};


if (!fs.existsSync(root + '/node_modules')){
  return console.log('No modules installed');
}

var licenses = fs.readdirSync(root + '/node_modules').reduce(function(all, name){

  var mod = {};

  // Invalid module (such as .bin)
  if (/^\./.test(name)) return all;

  // PACKAGE.JSON
  var pack = open(name, 'package.json', true);
  var license = !pack ? '-' : pack.license || pack.licenses || '-';
  license = Array.isArray(license) && license.length > 1 ? '?multiple' : license;
  license = Array.isArray(license) ? license[0] : license;
  license = license.type || license;
  license = typeof license === 'string' ? license : license.type ||  '? verify';
  mod.package = license.length > 1 ? license.replace(/\-/g, ' ') : license;


  // LICENSE (file)
  // Let's check it also with the file
  var file = open(name, 'LICENSE') || open(name, 'LICENSE.md')
    || open(name, 'License') || open(name, 'License.md')
    || open(name, 'license') || open(name, 'license.md')
    || open(name, 'LICENCE') || open(name, 'LICENCE.md')
    || open(name, 'Copying.txt') || open(name, 'COPYING.txt')
    || open(name, 'Copying') || open(name, 'COPYING')
    || open(name, 'Copying.md') || open(name, 'Copying.md');
  // mod.file = (!file) ? '-' : licenseRegex.filter(function(license){
  //   return license.regex.test(file);
  // }).map(function(license){
  //   // Need this double check in case only 'other' is matched, then extract it
  //   return license.name || file.match(license.regex)[1];
  // }).shift() || '? verify';


  mod.file = require('./lib/parselicense')(file, parsers, '? verify');



  // README
  var file = open(name, 'README') || open(name, 'README.md')
     || open(name, 'Readme') || open(name, 'Readme.md')
     || open(name, 'readme') || open(name, 'readme.md');
  // mod.readme = (!file) ? '-' : licenseRegex.filter(function(license){
  //   return license.regex.test(file);
  // }).map(function(license){
  //   return license.name || file.match(license.regex)[1];
  // }).shift() || '? verify';

  mod.readme = require('./lib/parselicense')(file, parsers, '-');

  all.package[mod.package] = [name].concat(all && all.package[mod.package] || []);
  all.file[mod.file] = [name].concat(all && all.file[mod.file] || []);
  all.readme[mod.readme] = [name].concat(all && all.readme[mod.readme] || []);



  // TOTAL
  all.modules[name] = [mod.package, mod.file, mod.readme].slice();
  check = [mod.package, mod.file, mod.readme].filter(function(lic){
    return lic && !/^\?none/.test(lic);
  });

  function hasMultiple(arr){
    return arr.filter(function(e, i){
      return !/\?/.test(e) && arr.indexOf(e) + 1 !== i;
    }) >= 2;
  }

  var total;
  if (!check || !check.length) {
    total = '?none';
  } else if (check.indexOf('?verify') !== -1) {
    total = '?verify';
  } else if (check.indexOf('?multiple') !== -1 || hasMultiple(check)) {
    total = '?multiple';
  } else {
    total = check.shift();
  }
  all.total[total] = [name].concat(all.total[total] || []);
  //console.log(name, check);

  return all;
}, deff);



// Display all of the info of the packages
var table = require('./lib/table');
var data = Object.keys(licenses.modules).map(key => {
  var one = licenses.modules[key];
  return [key].concat(one);
});

table(data, {
  'Module name': 25,
  'package': 14,
  'License': 14,
  'README': 14
}, { title: 'Licenses' });



var count = Object.keys(licenses.modules).reduce((all, key) => {
  var one = licenses.modules[key];
  // Only valid names and make a unique license type per package
  one = [...new Set(one.filter(name => /^[^\?\-]/.test(name)))];
  one.forEach(o => { all[o] = all[o] ? all[o] + 1 : 1; });
  return all;
}, {});

count = Object.keys(count)
  .map(name => ({ name: name, number: count[name] }))
  .sort((a, b) => b.number - a.number)
  .map(license => [license.name, license.number]);

table(count, { 'License': 30, 'Number': 9 }, { title: 'License count', margin: 17 });


module.exports = licenses;
