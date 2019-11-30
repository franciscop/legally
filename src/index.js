const minimist = require("minimist");
const legally = require("./legally");
const analysis = require("./analysis");
const remote = require("./remote");
const clean = require("./options");
const args = minimist(process.argv.filter(e => !/^\/.+$/.test(e)));

// node on windows inserts extra into argv that we need to remove
// could be a bug in minimist
if (/^win/.test(process.platform)) args._ = args._.slice(2);

args.routes = args._;

// Need to wait a bit before resolving
// See: https://stackoverflow.com/a/50451612/938236
var done = (function wait() {
  if (!done) setTimeout(wait, 1000);
})();

(async () => {
  try {
    const options = clean(args);
    console.log(
      `Working on "${options.routes.join(", ") ||
        "node_modules"}". It might take a while...`
    );
    const folder = await remote(options.routes);
    const licenses = await legally(folder);
    await analysis(licenses, options);
  } catch (error) {
    console.error(error, args);
    throw error;
  } finally {
    done = true;
  }
})();
