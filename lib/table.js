var style = require('./style');

// From https://github.com/zaftzaft/terminal-table/blob/master/index.js
var p;
var margin = '';

function log(row){

  console.log(margin + row);
}

function strN(width, char = ' '){
  var str = '';
  for (var i = 0; i < width; i++) {
    str += char;
  }
  return str;
}

function fixed (text, width, ch = ' '){
  text = ('' + text).slice(0, width);
  for (var i = text.length; i < width; i++) {
    text += ch;
  }
  return text;
}

// |---------------------------|----------------|----------------|----------------|
// |                                 Title                                        |
// |---------------------------|----------------|----------------|----------------|
function title(title, widths){
  var wid = title.length;
  var total = widths.reduce((a, b) => a + b + 3, 0) - 1;
  var left = parseInt((total - wid) / 2);
  log(p[0][0] + widths.map(col => p.h + strN(col, p.h) + p.h).join(p.h) + p[0][2]);
  log(p.v + widths.map(col => ' ' + strN(col, ' ') + ' ').join(' ') + p.v);
  log(p.v + strN(left) + '\u001b[1m' + title + '\u001b[22m' + strN(total - left - wid) + p.v);
  log(p.v + widths.map(col => ' ' + strN(col, ' ') + ' ').join(' ') + p.v);
}


// |---------------------------|----------------|----------------|----------------|
// | Module name               | package        | LICENSE        | README         |
// |---------------------------|----------------|----------------|----------------|
function header(columns, opt, repeat, nodisplay){
  var headers = Object.keys(columns);
  var widths = headers.map(head => columns[head]);
  var topl = opt.title ? p[1][0] : p[0][0];
  var topr = opt.title ? p[1][2] : p[0][2];
  var topc = repeat ? p[1][1] : p[0][1];
  log(topl + widths.map(col => p.h + strN(col, p.h) + p.h).join(topc) + topr);
  if (!nodisplay) {
    log(p.v + ' ' + headers.map((txt, i) => fixed(txt, widths[i])).join(' ' + p.v + ' ') + ' ' + p.v);
    log(p[1][0] + widths.map(col => p.h + strN(col, p.h) + p.h).join(p[1][1]) + p[1][2]);
  }
}



module.exports = function(data = [], columns = { '-': 76 }, opt = {}){
  var headers = Object.keys(columns);
  var widths = headers.map(head => columns[head]);
  opt.repeat = opt.repeat || false;
  margin = strN(opt.margin || 0);

  p = style(opt.border);

  log('\n');

  if (opt.title) {
    title(opt.title, widths);
  }

  header(columns, opt, false, columns instanceof Array);

  data.forEach((row, i) => {
    if (opt.repeat && i % opt.repeat === 0 && i != 0) {
      header(columns, opt, true);
    }
    log(row.reduce((all, row, i) => {
      if (row instanceof Array) row = row.join(' + ');
      all = all + p.v + ' ' + fixed(row, widths[i]) + ' ';
      return all;
    }, '') + p.v);
  });

  log(p[2][0] + widths.map(col => p.h + strN(col, p.h) + p.h).join(p[2][1]) + p[2][2]);
  log('\n');
}
