module.exports = function(text) {
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

  if (/MIT\/X11/.test(text)) {
    return 'MIT';
  }

  return text;
}
