#!/usr/bin/env node

// This bit only handles the Command Line Interface API, while the index.js
// handles the actual parsing
const minimist = require('minimist');
const legally = require('./');
const analysis = require('./src/analysis');
const clean = require('./src/options')
const args = minimist(process.argv.filter(e => !/^\/.+$/.test(e)));

// node on windows inserts extra into argv that we need to remove
// could be a bug in minimist
if (/^win/.test(process.platform)) args._ = args._.slice(2);

args.routes = args._;

// Need to wait a bit before resolving
// See: https://stackoverflow.com/a/50451612/938236
var done = (function wait () { if (!done) setTimeout(wait, 1000) })();


(async () => {
  try {
    const options = clean(args);
    console.log("Working on it. It will take a while...", args);
    const licenses = await legally(options);
    await analysis(licenses, options);
  } catch(error) {
    console.error(error, args);
    throw error;
  } finally {
    done = true;
  }
})();
