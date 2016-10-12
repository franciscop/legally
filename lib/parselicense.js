var normalize = require('./normalize');

var notfound = '-';

module.exports = function(text, parsers, def){
  if (!text) return notfound;
  var normal = normalize(text);

  parsers = parsers.map(parser =>
    Object.assign(parser, { normalized: parser.text ? normalize(parser.text) : false })
  );

  parsers = parsers.filter(parser =>
    parser.negateregex ? parser.negateregex.test(normal) : true
  );

  // Try to catch them with a regex
  var regexed = parsers.filter(parser =>
    parser.regex ? parser.regex.test(text) : false
  );
  if (regexed.length === 1) return regexed[0].name;
  if (regexed.length > 1) return regexed.map(parser => parser.name);

  // Try to catch them with the full text
  var fulltext = parsers.filter(parser => parser.normalized && normal.includes(parser.normalized));
  if (fulltext.length === 1) return fulltext[0].name;
  if (fulltext.length > 1) return fulltext.map(parser => parser.name);

  // Try to catch them with text fragments
  var fragments = parsers.filter(parser => parser.fragments && parser.fragments.length).map(parser =>
    Object.assign(parser, { chance: parser.fragments.map(normalize).filter(frag => normal.includes(frag)).length / parser.fragments.length })
  ).filter(parser => parser.chance > 0).sort((a, b) => b - a);
  if (fragments.length === 1) return fragments[0].name;
  if (fragments.length > 1) return fragments.map(parser => parser.name);

  return def;
}
