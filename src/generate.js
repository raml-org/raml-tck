var utils = require("./utils");
var parser = require("raml-1-parser");
var fs = require("fs");

module.exports = function(processFolder) {
  console.log("processing folder: " + processFolder);
  var dirs = utils.iterateFolders(processFolder);

  dirs.forEach(function(dir) {
    var tests = utils.prepareTests(dir);

    tests.forEach(function(test) {
      generateTCKFile(test.masterPath(), test.extensionsAndOverlays(), test.jsonPath())
    })
  });
}

function generateTCKFile(apiPath, extensions, tckJsonPath) {
  var api = parser.loadRAMLSync(apiPath, extensions);
  var expanded = api["expand"] ? api["expand"]() : api;
  expanded.setAttributeDefaults(true);

  var json = expanded.toJSON({ rootNodeDetails: true });

  if (!tckJsonPath) {
      tckJsonPath = utils.defaultJSONPath(apiPath);
  }

  fs.writeFileSync(tckJsonPath, JSON.stringify(json, null, 2));
  console.log("TCK JSON GENERATED: " + tckJsonPath);
}
