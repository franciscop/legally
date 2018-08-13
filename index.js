var legally = require('./lib/legally');
var analysis = require('./lib/analysis');
var remote = require('./lib/remote');

module.exports = (opt) => {
  opt = opt || {};
  if (typeof opt === 'string') {
    opt = { routes: [opt] };
  }
  if (Array.isArray(opt)) {
    opt = { routes: opt };
  }
  opt.routes = opt.routes || [];

  opt.show = opt.show || [];
  opt.show = opt.show instanceof Array ? opt.show : [opt.show];

  var shortnames = {p: 'packages', l: 'licenses', r: 'reports'};
  for (var key in shortnames) {
    if (opt[key]) {
      opt.show.push(shortnames[key]);
    }
  }

  if (opt.show.length === 0) {
    opt.show = ['packages', 'licenses', 'reports'];
  }

  opt.filter = opt.filter || [];
  opt.type = opt.type || [];
  opt.plain = Boolean(opt.plain);

  opt.filter = opt.filter instanceof Array ? opt.filter : [opt.filter];
  opt.type = opt.type instanceof Array ? opt.type : [opt.type];

  opt.width = opt.width || 80;
  opt.width = typeof opt.width === 'number' ? opt.width : 80;

  var licenses;
  if (!opt.routes.length) return legally(process.cwd());

  return remote(opt.routes).then(function (folder){
    console.log(folder);
    if (!folder) {
      console.log('Could not handle remote packages');
      process.exit();
    }
    return legally(folder);
  }).catch(function(error) {
    console.log(error);
    process.exit();
  });
};
