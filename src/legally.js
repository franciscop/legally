const { join, list, read, stat, walk } = require('fs-array');
const searchText = require('./search_text');
const searchJson = require('./search_json');

// Search for text in any of the matching regex files for the root
const search = (root, regex) => list(root)
  .filter(file => regex.test(file))
  .filter(file => stat(file).isFile())
  .map(read)
  .map(searchText)
  .reduce((all, one) => [...all, ...one], []);

// Require an absolute package
const pack = path => require(join(path, 'package.json'))

const isPackage = /package\.json$/;
const isLicense = /(license|copying)(\.md|\.txt)?$/i;
const isReadme = /readme(\.md|\.txt)?$/i;

// Root project to analize
module.exports = (root = './node_modules') => walk(root)
  .map(file => { console.log(file); return file; })
  .filter(file => isPackage.test(file))    // Only find package.json parent folders
  .filter(file => !/\/test\//.test(file))  // Avoid looking into some resolver tests
  .map(pkg => pkg.replace(isPackage, '')).map(async root => ({
    name: pack(root).name + '@' + pack(root).version,
    package: searchJson(pack(root)),
    copying: await search(root, isLicense),
    readme: await search(root, isReadme)
  }))
  .sort((a, b) => a.name.localeCompare(b.name))
  .reduce((obj, { name, ...one }) => ({ ...obj, [name]: one }), {});
