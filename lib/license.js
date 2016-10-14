var parsers = require('./parsers');
var clean = require('./clean');
var normalize = require('./normalize');
var parselicense = require('./parselicense');

module.exports = function(text, def = []){
  if (!text) return [];

  var all = [];

  var normal = normalize(text);

  parsers = parsers.filter(parser =>
    parser.negateregex ? parser.negateregex.test(normal) : true
  );

  // Try to catch them with a regex
  all = all.concat(parsers.filter(parser =>
    parser.regex ? parser.regex.test(text) : false
  ).map(parser => parser.name));

  // Try to catch them with the full text
  all = all.concat(parsers.filter(parser =>
    parser.normalized && normal.includes(parser.normalized)
  ).map(parser => parser.name));

  all = all.concat(parsers.filter(parser => parser.fragments && parser.fragments.length).map(parser =>
    Object.assign(parser, { chance: parser.fragments.map(normalize).filter(frag => normal.includes(frag)).length / parser.fragments.length })
  ).filter(parser => parser.chance > 0).sort((a, b) => b - a).map(parser => parser.name));

  // Only different licenses
  all = [...new Set(all)];

  return all.length ? all : def;
}
