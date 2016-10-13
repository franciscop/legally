var parsers = require('./parsers');
var clean = require('./clean');

// Return ['MIT', 'ISC']
module.exports = function (pack){
  var licenseStrings = ['license', 'licenses', 'licence', 'licences'];

  // Make sure we are using package.json
  if (!pack) return [];

  // Take the right part from package.json
  var name = licenseStrings.find(name => name in pack);
  if (!name) return [];

  // Make sure there's some license
  var licenses = pack[name];
  if (!licenses || licenses.length === 0) {
    return [];
  }

  // Empty object
  if (Object.keys(licenses).length === 0 && licenses.constructor === Object) {
    return [];
  }



  // Normalize the data

  // 1. Make sure it's an array
  // 'a' => ['a']
  if (!(licenses instanceof Array)) {
    licenses = [licenses];
  }

  // 2. Make sure it's an array of objects
  // [{ type: 'a' }, { type: 'b' }] => ['a', 'b']
  licenses = licenses.map(lic => lic.type ? lic.type : lic);

  // 3. Remove anything left that is not a string
  // ['a', {}, Date, 'b'] => ['a', 'b']
  licenses = licenses.filter(lic => typeof lic === 'string');

  licenses = [].concat.apply([], licenses.map(lic => {
    if (/^\s*\(.*(AND|OR).*\)\s*$/.test(lic)) {
      return lic
        .replace(/^\s*\(/, '')  // Remove spaces before/after
        .replace(/\)\s*$/, '')
        .split(/\s*(?:AND|OR)\s*/);  // Separate it and remove spaces around
    }
    return lic;
  }));

  licenses = [].concat.apply([], licenses.map(lic => {
    if (/\s+(AND|OR)\s+/.test(lic)) {
      return lic.split(/\s*(?:AND|OR)\s*/); // Separate it and remove spaces around
    }
    return lic;
  }));

  return licenses.map(clean);
}
