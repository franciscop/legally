// Normalize the text to search and the license name
module.exports = (text = '') => ('' + text)
  .toLowerCase()             // All lowercase
  .replace(/[^\w\s]/g, ' ')  // Only words
  .replace(/\s+/g, ' ')      // Only one whitespace
  .replace(/^\s+/, '')       // No leading spaces
  .replace(/\s+$/, '');      // No trailing spaces
