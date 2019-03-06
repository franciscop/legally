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
const pack = path => {
  try {
    return require(join(path, 'package.json'));
  } catch (error) {
    return;
  }
};

const isPackage = /(\/|\\)package\.json$/;
const isLicense = /(license|copying)(\.md|\.txt)?$/i;
const isReadme = /readme(\.md|\.txt)?$/i;
const isTestFile = /(\/test\/)|(\\test\\)/

// Root project to analize
module.exports = (root = './node_modules') => walk(root)
  .filter(file => isPackage.test(file))    // Only find package.json parent folders
  .filter(file => !isTestFile.test(file))  // Avoid looking into some resolver tests
  .map(pkg => pkg.replace(isPackage, ''))
  .filter(file => pack(file))
  .map(async root => ({
    name: pack(root).name + '@' + pack(root).version,
    package: searchJson(pack(root)),
    copying: await search(root, isLicense),
    readme: await search(root, isReadme)
  }))
  .sort((a, b) => a.name.localeCompare(b.name))
  .reduce((obj, { name, ...one }) => ({ ...obj, [name]: one }), {});
