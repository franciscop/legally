const table = require('./table');
const normal = require('./normalize');

const filters = ({ filter, type }) => lic => {
  lic = normal(lic);
  filter = filter.map(normal);
  type = type.map(normal);
  if (!lic || (!filter.length && !type.length)) return true;
  return filter.some(fil => lic.includes(fil)) || type.includes(lic);
}

module.exports = function(licenses, opt){
  if (!Object.keys(licenses).length) {
    throw new Error('No modules found. Are you in the right directory?');
  }

  const display = item => item.filter(filters(opt)).join(' + ') || '-';
  const data = Object.entries(licenses).map(([
    name, { package, copying, readme }
  ]) => [
    name, display(package), display(copying), display(readme)
  ]);

  if (opt.show.includes('packages')) {
    table(data, {
      'Module name': parseInt(25 * opt.width / 80),
      'package': parseInt(14 * opt.width / 80),
      'License': parseInt(14 * opt.width / 80),
      'README': parseInt(14 * opt.width / 80)
    }, { title: 'Packages (' + data.length + ')', repeat: 50, ...opt });
  }


  // Count each of the licenses
  var count = data.reduce((all, one) => {
    // Only valid names and make a unique license type per package
    one = [...new Set(one.slice(1)
      .reduce((all, one) => all.concat(one.split(' + ')), [])
      .filter(name => /^[^\?\-]/.test(name))
      .filter((name, i, all) => !(name === 'Apache' && all.includes('Apache 2.0')))
      .filter((name, i, all) => !(name === 'BSD' && all.find(a => /BSD\s\d/.test(a))))
    )];
    one.forEach(o => { all[o] = (all[o] || 0) + 1; });
    return all;
  }, {});

  var total = Object.keys(count).reduce((total, key) => total + count[key], 0);

  count = Object.keys(count)
    .map(name => ({ name: name, number: count[name], part: count[name] / total }))
    .sort(function(a, b){
      if (b.number !== a.number) return b.number - a.number;
      if(a.name < b.name) return -1;
      if(a.name > b.name) return 1;
      return 0;
    })
    .map((lic, i, all) => [lic.name, lic.number, parseInt(lic.part * 100) ]);

  if (opt.show.includes('licenses')) {
    table(count, {
      License: parseInt(40 * opt.width / 80),
      Number: parseInt(12 * opt.width / 80),
      '%': parseInt(12 * opt.width / 80)
    }, Object.assign({ title: 'Licenses (' + total + ')', margin: 3 }, opt)
    );
  }


  // REPORT

  var facts = [];

  var licensed = data.map(e => e.slice(1).join('')).filter(e => !/^\-+$/.test(e));

  if (licensed.length === data.length) {
    facts.push(['Great! All the dependencies are licensed']);
  } else {
    var notPerc = parseInt(100 * (data.length - licensed.length) / data.length);
    var notPart = (data.length - licensed.length) + '/' + data.length;
    var all = opt.type.concat(opt.filter);
    if (all.length) {
      var filtered = all.join('" NOR "');
      facts.push([notPerc + '% of the dependencies are not "' + filtered + '" (' + notPart + ')']);
    }
    else {
      facts.push([notPerc + '% of the dependencies are unlicensed (' + notPart + ')']);
    }
  }

  var verify = data.filter(e => e.slice(1).filter(e => /^\?/.test(e)).length);
  if (verify.length) {
    var one = verify.length === 1;
    facts.push(['There ' + (one ? 'is' : 'are') + ' ' + verify.length + ' dependenc' + (one ? 'y' : 'ies') + ' that could not be parsed automatically']);
    var sup = verify.map(one => one.slice(1).filter(e => !/^(-|\? verify)$/.test(e)));
    if (sup.length === verify.length) {
      facts.push(['  But ' + (one ? 'it has' : 'all of them have') + ' another valid license']);
    } else {
      one = verify.length - sup.length === 1;
      facts.push(['  And ' + (verify.length - sup.length) + (one ? 'has' : 'have') + ' no valid license']);
    }
  }

  if (opt.show.includes('reports')) {
    table(facts,
      [parseInt(70 * opt.width / 80)],
      Object.assign({ title: 'Reports', margin: 3 }, opt)
    );
  }
}
