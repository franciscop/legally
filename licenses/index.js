module.exports = [
  './apache',
  './apache-2',
  './bsd-2',
  './bsd-3',
  './cc0',
  './isc',
  './mit',
  './unlicense'
].map(lic => require(lic)).concat(...require('./raw'));
