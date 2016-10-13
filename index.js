#!/usr/bin/env node

var licenses = require('./lib/legally')(process.cwd());

if (Object.keys(licenses).length === 0) {
  console.error('No modules installed. Are you in the right directory?');
  return;
}

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
}, { title: 'Packages in your project', repeat: 50 });



var count = data.reduce((all, one) => {
  // Only valid names and make a unique license type per package
  one = [...new Set(one.slice(1)
    .reduce((all, one) => all.concat(one.split(' + ')), [])
    .filter(name => /^[^\?\-]/.test(name))
    .filter((name, i, all) => !(name === 'Apache' && all.includes('Apache 2.0')))
    .filter((name, i, all) => !(name === 'BSD' && all.find(a => /BSD\s\d/.test(a))))
  )];
  one.forEach(o => { all[o] = (all[o] || 0) + 1; });
  return all;
}, {});

var total = Object.keys(count).reduce((total, key) => total + count[key], 0);

count = Object.keys(count)
  .map(name => ({ name: name, number: count[name], part: count[name] / total }))
  .sort(function(a, b){
    if (b.number !== a.number) return b.number - a.number;
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  })
  .map((lic, i, all) => [lic.name, lic.number, parseInt(lic.part * 100) ]);

table(count, { 'License': 30, 'Number': 10, '%': 10 }, { title: 'License count (' + total + ')', margin: 10 });


// REPORT

var facts = [];

var licensed = data.map(e => e.slice(1).join('')).filter(e => !/^\-+$/.test(e));

if (licensed.length === data.length) {
  facts.push(['Great! All your dependencies are licensed']);
} else {
  facts.push([parseInt(100 * (data.length - licensed.length) / data.length) + '% of your dependencies are unlicensed (' + (data.length - licensed.length) + '/' + data.length + ')']);
}

var verify = data.filter(e => e.slice(1).filter(e => /^\?/.test(e)).length);
if (verify.length) {
  facts.push(['There are ' + verify.length + ' dependencies that could not be parsed']);
  var sup = verify.map(one => one.slice(1).filter(e => !/^(-|\? verify)$/.test(e)));
  if (sup.length === verify.length) {
    facts.push(['  But all of them have another valid license']);
  } else {
    facts.push(['  And ' + (verify.length - sup.length) + ' have no valid license']);
  }
}

table(facts, [70], { title: 'Report', margin: 3 });

module.exports = licenses;
