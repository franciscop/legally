//Extracts licenses from the CSV file licenses.csv
//The licenses.csv file was generated using the Software Package Data Exchange list of licenses
//https://spdx.org/licenses/

var fs = require("fs");
fs.readFile("licenses.csv", 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var licenses = data.split("\n");
  var jsonLicenses = [];
  for (var i = 0; i < licenses.length; i++) {
    var items = licenses[i].split(",");
    var item = {};
    item.name = items[0];
    item.identifier = items[1];
    item.shortIdentifier = items[2];
    item.osiApproved = ((items[3] === "Y") ? true : false);
    item.regex = new RegExp(item.identifier + "|" + item.name.replace(/ /g, "(.)") + "|" + item.shortIdentifier, "i").toString();

    jsonLicenses.push(item);
  }

  fs.writeFile("licenses.js", "module.exports = " + JSON.stringify(jsonLicenses));

});