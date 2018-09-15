const lics = require('../licenses');

module.exports = function(text) {
  text = text.replace(/^\W*/, '').replace(/\W*$/, '');

  if (text && text.length > 1) {
    text = text.replace(/[\-\,]+/g, ' ').replace(/\s+/g, ' ');
  }

  if (/(V|v)ersion\s\d/.test(text)) {
    text = text.replace(/(V|v)ersion\s*/, '');
  }

  if (/[V|v]\d/.test(text)) {
    text = text.replace(/[Vv](\d)\s*/, (n, d) => ' ' + d);
  }

  if (/(L|l)icense\s\d/.test(text)) {
    text = text.replace(/(L|l)icense\s*/, '');
  }

  var found = lics.find(lic => lic.regex.test(text));
  if (found) return found.name;

  if (/MIT\/X11/.test(text)) {
    return 'MIT';
  }

  if (/Apache\s?2/i.test(text)) {
    return 'Apache 2.0';
  }

  return text;
}
