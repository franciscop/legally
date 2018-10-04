const legally = require('./src/legally');
const analysis = require('./src/analysis');
const remote = require('./src/remote');
const clean = require('./src/options');

module.exports = async opts => {
  // Clean the options with the right defaults
  opts = clean(opts);
  const folder = await remote(opts.routes);
  return await legally(folder);
};
