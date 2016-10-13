#!/usr/bin/env node

var legally = require('./lib/legally');
var analysis = require('./lib/analysis');
var remote = require('./lib/remote');


// Process the command line arguments
var opt = process.argv.filter(e => !/\/.+$/.test(e)).reduce((opt, arg, i, all) => {
  if (/^\-+/.test(arg)) {
    if (/\=/.test(arg)) {
      parts = arg.replace(/^\-+/, '').split('=');
      opt[parts[0]] = parts[1];
    } else {
      opt[arg.replace(/^\-+/, '')] = all[i + 1] || !/^\-\-/.test(arg)
    }
  } else {
    console.log("WTF", arg);
    opt.remote = (opt.remote || []).concat(arg);
  }
  return opt;
}, { packages: false, licenses: false, reports: false });

if (!opt.packages && !opt.licenses && !opt.reports) {
  opt.packages = true;
  opt.licenses = true;
  opt.reports = true;
}

var licenses;
if (opt.remote) {
  remote(opt.remote, function(err, folder){
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
