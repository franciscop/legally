var parsers = require('./parsers');
var clean = require('./clean');
var normalize = require('./normalize');
var parselicense = require('./parselicense');

module.exports = function(text){
  if (!text) return [];

  var normal = normalize(text);

  parsers = parsers.filter(parser =>
    parser.negateregex ? parser.negateregex.test(normal) : true
  );

  // Try to catch them with a regex
  var regexed = parsers.filter(parser =>
    parser.regex ? parser.regex.test(text) : false
  ).map(parser => parser.name);
  if (regexed.length) return regexed;

  // Try to catch them with the full text
  var fulltext = parsers.filter(parser =>
    parser.normalized && normal.includes(parser.normalized)
  ).map(parser => parser.name);
  if (fulltext.length) return fulltext;

  var fragments = parsers.filter(parser => parser.fragments && parser.fragments.length).map(parser =>
    Object.assign(parser, { chance: parser.fragments.map(normalize).filter(frag => normal.includes(frag)).length / parser.fragments.length })
  ).filter(parser => parser.chance > 0).sort((a, b) => b - a).map(parser => parser.name);
  if (fragments.length) return fragments;

  return [];
}
