module.exports = { readme: [], license: [] };

['', '.md', '.txt'].forEach(ext => {
  ['LICENSE', 'License', 'license', 'COPYING', 'Copying', 'copying'].forEach(name => {
    module.exports.license.push(name + ext);
  });
  ['README', 'Readme', 'readme'].forEach(name => {
    module.exports.readme.push(name + ext);
  });
});
