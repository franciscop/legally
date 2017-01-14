#!/usr/bin/env node

var legally = require('./lib/legally');
var analysis = require('./lib/analysis');
var remote = require('./lib/remote');
var opt = require('minimist')(process.argv.filter(e => !/\/.+$/.test(e)));

var isWin = /^win/.test(process.platform);

opt.show = opt.show || [];
opt.show = opt.show instanceof Array ? opt.show : [opt.show];

var shortnames = {p: 'packages', l: 'licenses', r: 'reports'};
for (var key in shortnames) {
  if (opt[key]) {
    opt.show.push(shortnames[key]);
  }
}

if (opt.show.length === 0) {
  opt.show = ['packages', 'licenses', 'reports'];
}

opt.filter = opt.filter || [];
opt.type = opt.type || [];

opt.filter = opt.filter instanceof Array ? opt.filter : [opt.filter];
opt.type = opt.type instanceof Array ? opt.type : [opt.type];

opt.width = opt.width || 80;
opt.width = typeof opt.width === 'number' ? opt.width : 80;

// node on windows inserts extra into argv that we need to remove
// could be a bug in minimist
if (isWin) {
  opt._ = opt._.slice(2);
}

var licenses;
if (opt._.length) {
  remote(opt._, function(err, folder){
    if (err || !folder) {
      console.log('Could not handle remote packages');
      process.exit();
    }
    analysis(legally(folder), opt);
  });
} else {
  licenses = legally(process.cwd());
  analysis(licenses, opt);
}

module.exports = licenses;
