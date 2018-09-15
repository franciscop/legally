const { tmpdir } = require('os');
const { join, mkdir, remove } = require('fs-array');
const exec = require('util').promisify(require('child_process').exec);

// Allow only for alphanumeric and special characters _.-@
const sanitize = name => name
  .replace(/^[^\w]/, '')   // Begins by a letter, number or underscore
  .replace(/[^\w\-.@]/g, '')
  .replace(/[^\w]$/, '');   // Ends by a letter, number or underscore

module.exports = async packages => {
  if (!packages || !packages.length) return './node_modules';
  console.log("Working on it. It will take a while...");

  // Create an empty temporary file
  const tmp = await mkdir(join(tmpdir(), 'legally')).then(remove).then(mkdir);
  const packs = packages.map(sanitize).join(' ');
  // Need to be in a single place to keep the folder context
  await exec(`cd "${tmp}" && npm init --yes && npm install ${packs} --ignore-scripts`);
  return tmp;
};
