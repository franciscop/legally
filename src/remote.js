const { tmpdir } = require('os');
const { exists, join, mkdir, remove, stat } = require('fs-array');
const exec = require('util').promisify(require('child_process').exec);

// Cache time of 100000 seconds
const CACHE = parseInt(process.env.CACHE || 100000, 10);

// Allow only for alphanumeric and special characters _.-@
const sanitize = name => name
  .replace(/^[^\w@]/, '')   // Begins by a letter, number or underscore
  .replace(/[^\w\-.@\/]/g, '') // Remove any forward slash
  .replace(/[^\w]$/, '');   // Ends by a letter, number or underscore

module.exports = async packages => {
  if (!packages || !packages.length) return './node_modules';

  if (!(await exists(join(tmpdir(), 'legally')))) {
    await mkdir(join(tmpdir(), 'legally'))
  }

  // Remove ramining files somehow
  if (await exists(join(tmpdir(), 'legally', 'package.json'))) {
    await mkdir(join(tmpdir(), 'legally')).then(remove).then(mkdir);
  }

  // Create an empty namespaced temporary folder
  const tmp = join(tmpdir(), 'legally', 'pack-' + sanitize(packages.join('-')));

  // It is already cached, so we don't need to worry about it
  if (await exists(tmp) && new Date() - await stat(tmp).atime < CACHE) {
    return join(tmp, 'node_modules');
  }

  console.log('Temporary:', tmp);

  // Create the temporary folder
  await mkdir(tmp).then(remove).then(mkdir);
  const packs = packages.map(sanitize).join(' ');
  // Need to be in a single place to keep the folder context
  await exec(`cd "${tmp}" && npm init --yes && npm install ${packs} --ignore-scripts`);
  return join(tmp, 'node_modules');
};
