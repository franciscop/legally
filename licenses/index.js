const raw = require("./raw");
module.exports = [
  require("./apache"),
  require("./apache-2"),
  require("./bsd-2"),
  require("./bsd-3"),
  require("./cc0"),
  require("./isc"),
  require("./mit"),
  require("./unlicense"),
  ...raw
];
