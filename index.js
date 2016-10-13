#!/usr/bin/env node

var licenses = require('./lib/legally')(process.cwd());

// Display all of the info of the packages
var table = require('./lib/table');
var data = Object.keys(licenses).map(key => {
  var one = licenses[key];
  return [key].concat(Object.keys(one).map(name => one[name].join(' + ') || '-'));
});

table(data, {
  'Module name': 25,
  'package': 14,
  'License': 14,
  'README': 14
}, { title: 'Licenses', repeat: 30 });



var count = data.reduce((all, one) => {
  // Only valid names and make a unique license type per package
  one = [...new Set(one.slice(1)
    .reduce((all, one) => all.concat(one.split(' + ')), [])
    .filter(name => /^[^\?\-]/.test(name))
    .filter((name, i, all) => !(name === 'Apache' && all.includes('Apache 2.0')))
    .filter((name, i, all) => !(name === 'BSD' && all.find(a => /BSD\s\d/.test(a))))
  )];
  one.forEach(o => { all[o] = all[o] ? all[o] + 1 : 1; });
  return all;
}, {});

count = Object.keys(count)
  .map(name => ({ name: name, number: count[name] }))
  .sort(function(a, b){
    if (b.number !== a.number) return b.number - a.number;
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  })
  .map(license => [license.name, license.number]);

table(count, { 'License': 30, 'Number': 9 }, { title: 'License count', margin: 17 });


module.exports = licenses;
