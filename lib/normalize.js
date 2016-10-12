
module.exports = function (text){
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\s+/, '')
    .replace(/\s+$/, '');
}
