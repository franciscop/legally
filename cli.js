#!/usr/bin/env node

// This bit only handles the Command Line Interface API, while the index.js
// handles the actual parsing
var legally = require('./');
var analysis = require('./lib/analysis');
var opt = require('minimist')(process.argv.filter(e => !/\/.+$/.test(e)));

// node on windows inserts extra into argv that we need to remove
// could be a bug in minimist
if (/^win/.test(process.platform)) {
  opt._ = opt._.slice(2);
}

opt.routes = opt._;

var done = (function wait () { if (!done) setTimeout(wait, 1000) })();

Promise.resolve(legally(opt)).then(function(licenses) {
  analysis(licenses, opt);
  done = true;
});
