#!/usr/bin/env node

var fs = require('fs');

var licenseRegex = [
  
  // Some defaults with non-capturing groups (?:)
  { name: 'MIT', regex: /(?:The )?MIT(?: (L|l)icense)/ },
  { name: 'BSD', regex: /(?:The )?BSD(?: (L|l)icense)/ },
  { name: 'ISC', regex: /(?:The )?ISC(?: (L|l)icense)/ },
  
  // This will attempt to capture the name and display it
  { name: false, regex: /(?:The )?([\w-/\.]{3,}?) (L|l)icense/ }
];



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
  var license = !pack ? '?none' : pack.license || pack.licenses || '?none';
  license = Array.isArray(license) && license.length > 1 ? '?multiple' : license;
  license = typeof license === 'string' ? license : license.type ||  '?verify';
  mod.package = license;
  
  
  // LICENSE (file)
  // Let's check it also with the file
  var file = open(name, 'LICENSE') || open(name, 'LICENSE.md')
    || open(name, 'License') || open(name, 'License.md')
    || open(name, 'license') || open(name, 'license.md');
  mod.file = (!file) ? '?none' : licenseRegex.filter(function(license){
    return license.regex.test(file);
  }).map(function(license){
    // Need this double check in case only 'other' is matched, then extract it
    return license.name || file.match(license.regex)[1];
  }).shift() || '?verify';
  
  
  // README
  var file = open(name, 'README') || open(name, 'README.md')
     || open(name, 'Readme') || open(name, 'Readme.md')
     || open(name, 'readme') || open(name, 'readme.md');
  mod.readme = (!file) ? '?none' : licenseRegex.filter(function(license){
    return license.regex.test(file);
  }).map(function(license){
    return license.name || file.match(license.regex)[1];
  }).shift() || '?verify';
  
  
  
  
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
var log = console.log;

log("\n\n|------------------------------|---------------|---------------|---------------|");
    log("| Module name                  | package       | LICENSE       | README        |");
    log("|------------------------------|---------------|---------------|---------------|");
for (var name in licenses.modules) {
  var len = 30 - name.length;
  var str = '| ' + name + new Array(len > 0 ? len : 0).join(' ');
  str += '| ' + licenses.modules[name].map(function(name){
    var len = 15 - name.length;
    return name + new Array(len > 0 ? len : 0).join(' ');
  }).join('| ') + '|';
  console.log(str);
}
    log("|------------------------------|---------------|---------------|---------------|\n");
  
//console.log("\n\nResult: \n", licenses.total);
