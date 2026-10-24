import minimist from "minimist";
import legally from "./legally.js";
import analysis from "./analysis.js";
import remote from "./remote.js";
import clean from "./options.js";

async function RunNow() {
  const args = minimist(process.argv.filter((e) => !/^\/.+$/.test(e)));
  var done;
  var options;
  var folder;
  var licenses;

  // node on windows inserts extra into argv that we need to remove
  // could be a bug in minimist
  if (process.platform.startsWith("win")) {
    args._ = args._.slice(2);
  }
  args.routes = args._;

  // Need to wait a bit before resolving
  // See: https://stackoverflow.com/a/50451612/938236
  done = (function wait() {
    if (!done) setTimeout(wait, 1000);
  })();

  try {
    options = clean(args);
    console.log(
      `Working on "${
        options.routes.join(", ") || "node_modules"
      }". It might take a while...`,
    );
    folder = await remote(options.routes);
    licenses = await legally(folder);
    await analysis(licenses, options);
  } catch (error) {
    console.error(error, args);
    throw error;
  } finally {
    done = true;
  }
}

const api = async (args) => {
  // imported as node-node module and not running via CLI
  const options = clean(args);
  const folder = await remote(options.routes);
  const licenses = await legally(folder);
  return licenses;
};
api.RunNow = RunNow; // CLI
export default api;
