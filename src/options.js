const validate = require("validate-npm-package-name");
const invalid = name => !validate(name).validForNewPackages;
const nameWithoutVersion = entry => {
  const index = entry.indexOf("@");
  if (index === -1) { return entry };
  return entry.substring(0, index);
}

module.exports = (opt = {}) => {
  // Clone the object to avoid modifying the reference
  opt = JSON.parse(JSON.stringify(opt));

  // Make sure it is of the right type
  if (typeof opt === "string") opt = { routes: [opt] };
  if (Array.isArray(opt)) opt = { routes: opt };
  opt.routes = opt.routes || [];

  const bad = opt.routes.map(nameWithoutVersion).find(invalid);
  if (bad) {
    throw new Error(`Invalid package name: "${bad}"`);
  }

  opt.show = opt.show || [];
  opt.show = Array.isArray(opt.show) ? opt.show : [opt.show];

  // Short names for showing only a special report
  if (opt.p) opt.show.push("packages");
  if (opt.l) opt.show.push("licenses");
  if (opt.r) opt.show.push("reports");

  if (!opt.show.length) opt.show = ["packages", "licenses", "reports"];

  opt.filter = opt.filter || [];
  opt.type = opt.type || [];
  opt.plain = Boolean(opt.plain);

  opt.filter = Array.isArray(opt.filter) ? opt.filter : [opt.filter];
  opt.type = Array.isArray(opt.type) ? opt.type : [opt.type];

  opt.width = opt.width || 80;
  opt.width = typeof opt.width === "number" ? opt.width : 80;

  return opt;
};
