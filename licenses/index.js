module.exports = [
  './apache',
  './bsd-2',
  './bsd-3',
  './cc0',
  './isc',
  './mit',
  './unlicense'
].map(lic => require(lic)).concat(...require('./raw'));
